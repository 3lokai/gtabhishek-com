#!/usr/bin/env python3
"""
Lightweight Flask server to trigger benchmark tests
Designed to work with existing benchmark_model.py system
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import threading
import os
import logging
import json
from datetime import datetime
from pathlib import Path
import psycopg2

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "https://*.gtabhishek.com"], 
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization", "X-Requested-With"])
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Configuration for Docker environment
BENCHMARK_SCRIPT_PATH = Path("/workspace/benchmark_model.py")
WORKING_DIR = Path("/workspace")

# Database connection helper
def get_db_connection():
    """Connect to Postgres database"""
    return psycopg2.connect(
        host="postgres",  # Docker service name
        database="db",
        user="user",
        password="password",
        port=5432
    )

@app.route('/api/dashboard-summary')
def dashboard_summary():
    """Main dashboard summary widget"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Debug: Check total records and recent records
        cur.execute("SELECT COUNT(*) FROM benchmark_results")
        total_records = cur.fetchone()[0]
        
        cur.execute("SELECT COUNT(*) FROM benchmark_results WHERE timestamp > NOW() - INTERVAL '30 days'")
        recent_30d = cur.fetchone()[0]
        
        cur.execute("SELECT MAX(timestamp) FROM benchmark_results")
        latest_timestamp = cur.fetchone()[0]
        
        # Get summary stats from last 30 days
        cur.execute("""
            WITH recent_stats AS (
                SELECT 
                    COUNT(*) as total_tests,
                    AVG(quality_score) as avg_score,
                    COUNT(*) FILTER (WHERE success = true) * 100.0 / NULLIF(COUNT(*), 0) as success_rate,
                    MAX(timestamp) as last_run
                FROM benchmark_results 
                WHERE timestamp > NOW() - INTERVAL '30 days'
            ),
            best_model AS (
                SELECT model_name, AVG(quality_score) as score
                FROM benchmark_results 
                WHERE timestamp > NOW() - INTERVAL '30 days' AND success = true
                GROUP BY model_name ORDER BY score DESC LIMIT 1
            )
            SELECT 
                COALESCE(r.total_tests, 0) as total_tests,
                COALESCE(r.avg_score, 0) as avg_score,
                COALESCE(r.success_rate, 0) as success_rate,
                r.last_run,
                COALESCE(b.model_name, 'No data') as best_model,
                COALESCE(b.score, 0) as best_score
            FROM recent_stats r
            LEFT JOIN best_model b ON true
        """)
        
        result = cur.fetchone()
        cur.close()
        conn.close()
        
        if result:
            return jsonify({
                "tests_7d": int(result[0]),
                "avg_score": round(float(result[1]), 1),
                "success_rate": round(float(result[2]), 1),
                "last_run": result[3].strftime("%m/%d %H:%M") if result[3] else "Never",
                "best_model": result[4],
                "best_score": round(float(result[5]), 1)
            })
        else:
            return jsonify({
                "tests_7d": 0,
                "avg_score": 0,
                "success_rate": 0,
                "last_run": "No data",
                "best_model": "No data",
                "best_score": 0
            })
    except Exception as e:
        return jsonify({
            "error": str(e),
            "tests_7d": 0,
            "avg_score": 0,
            "success_rate": 0,
            "last_run": "Error",
            "best_model": "Error",
            "best_score": 0
        }), 500

@app.route('/api/system-health')
def system_health():
    """System health check with recent benchmark info and server status"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Check recent benchmarks
        cur.execute("""
            SELECT COUNT(*) 
            FROM benchmark_results 
            WHERE timestamp > NOW() - INTERVAL '30 days' 
              AND success = true
        """)
        recent_benchmarks = cur.fetchone()[0]
        
        cur.close()
        conn.close()
        
        # Get system CPU usage
        try:
            import psutil
            cpu_usage = psutil.cpu_percent(interval=1)
        except:
            cpu_usage = 0
        
        # Determine health status
        if recent_benchmarks > 0:
            status = "🟢 Healthy"
        else:
            status = "🟡 No recent tests"
        
        return jsonify({
            "server": "ai-labs-trigger",
            "version": "1.0.0",
            "status": status,
            "recent_benchmarks": recent_benchmarks,
            "cpu_usage": round(cpu_usage, 1),
            "last_check": datetime.now().strftime("%H:%M:%S"),
            "timestamp": datetime.now().isoformat(),
            "endpoints": {
                "run_test": "POST /run-test",
                "run_batch": "POST /run-batch", 
                "list_roles": "GET /list-roles",
                "get_roles": "GET /api/roles",
                "get_role_detail": "GET /api/roles/<role_name>",
                "health": "GET /health",
                "system_health": "GET /api/system-health",
                "dashboard_summary": "GET /api/dashboard-summary",
                "performance_matrix": "GET /api/performance-matrix",
                "benchmarks": "GET /api/benchmarks",
                "benchmark_detail": "GET /api/benchmarks/<id>"
            },
            "configuration": {
                "benchmark_script": str(BENCHMARK_SCRIPT_PATH),
                "working_directory": str(WORKING_DIR)
            }
        })
    except Exception as e:
        return jsonify({
            "server": "ai-labs-trigger",
            "version": "1.0.0",
            "status": "🔴 Error",
            "recent_benchmarks": 0,
            "cpu_usage": 0,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/run-test', methods=['POST'])
def run_test():
    """Trigger a benchmark test"""
    try:
        data = request.json
        model = data.get('model', '').strip()
        role = data.get('role', '').strip()
        test_id = data.get('test_id', '').strip()
        
        if not model:
            return jsonify({"error": "Missing required field: model"}), 400
        
        # Determine the command to run
        if role and test_id:
            # Specific test
            cmd = [
                'python', str(BENCHMARK_SCRIPT_PATH),
                model, '--role-test', test_id
            ]
            test_type = f"specific test {test_id}"
        elif role:
            # All tests for role
            cmd = [
                'python', str(BENCHMARK_SCRIPT_PATH),
                model, '--role', role
            ]
            test_type = f"all {role} tests"
        else:
            # Default benchmark
            cmd = [
                'python', str(BENCHMARK_SCRIPT_PATH),
                model
            ]
            test_type = "default benchmark"
        
        def run_benchmark():
            try:
                logging.info(f"Starting benchmark: {model} - {test_type}")
                
                result = subprocess.run(
                    cmd, 
                    capture_output=True, 
                    text=True, 
                    timeout=600,  # 10 min timeout
                    cwd=str(WORKING_DIR)
                )
                
                if result.returncode == 0:
                    logging.info(f"✅ Benchmark completed successfully: {model} - {test_type}")
                else:
                    logging.error(f"❌ Benchmark failed: {model} - {test_type}")
                    logging.error(f"Error output: {result.stderr}")
                
            except subprocess.TimeoutExpired:
                logging.error(f"⏰ Benchmark timeout: {model} - {test_type}")
            except Exception as e:
                logging.error(f"💥 Benchmark exception: {model} - {test_type} - {e}")
        
        # Run in background thread
        thread = threading.Thread(target=run_benchmark, daemon=True)
        thread.start()
        
        return jsonify({
            "status": "started",
            "model": model,
            "role": role,
            "test_id": test_id,
            "test_type": test_type,
            "timestamp": datetime.now().isoformat(),
            "message": f"Benchmark started for {model} - {test_type}"
        })
        
    except Exception as e:
        logging.error(f"Request processing error: {e}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/run-batch', methods=['POST'])
def run_batch():
    """Trigger batch benchmark for multiple models/roles"""
    try:
        data = request.json
        models = data.get('models', [])
        roles = data.get('roles', [])
        
        if not models:
            return jsonify({"error": "Missing required field: models"}), 400
        
        if not roles:
            return jsonify({"error": "Missing required field: roles"}), 400
        
        def run_batch_benchmarks():
            total_tests = len(models) * len(roles)
            completed = 0
            
            logging.info(f"Starting batch benchmark: {total_tests} tests")
            
            for model in models:
                for role in roles:
                    try:
                        cmd = [
                            'python', str(BENCHMARK_SCRIPT_PATH),
                            model, '--role', role
                        ]
                        
                        logging.info(f"Running: {model} - {role} ({completed + 1}/{total_tests})")
                        
                        result = subprocess.run(
                            cmd, 
                            capture_output=True, 
                            text=True, 
                            timeout=600,
                            cwd=str(WORKING_DIR)
                        )
                        
                        completed += 1
                        
                        if result.returncode == 0:
                            logging.info(f"✅ Completed: {model} - {role}")
                        else:
                            logging.error(f"❌ Failed: {model} - {role}")
                            
                    except subprocess.TimeoutExpired:
                        logging.error(f"⏰ Timeout: {model} - {role}")
                        completed += 1
                    except Exception as e:
                        logging.error(f"💥 Error: {model} - {role} - {e}")
                        completed += 1
            
            logging.info(f"Batch benchmark completed: {completed}/{total_tests} tests")
        
        # Run in background thread
        thread = threading.Thread(target=run_batch_benchmarks, daemon=True)
        thread.start()
        
        return jsonify({
            "status": "started",
            "models": models,
            "roles": roles,
            "total_tests": len(models) * len(roles),
            "timestamp": datetime.now().isoformat(),
            "message": f"Batch benchmark started for {len(models)} models × {len(roles)} roles"
        })
        
    except Exception as e:
        logging.error(f"Batch request error: {e}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

def load_role_prompts():
    """Load role prompts from JSON file"""
    prompts_file = WORKING_DIR / "role_prompts.json"
    if prompts_file.exists():
        with open(prompts_file, 'r') as f:
            return json.load(f)
    return None

@app.route('/list-roles', methods=['GET'])
def list_roles():
    """Get list of available roles with full details from role_prompts.json"""
    try:
        data = load_role_prompts()
        if data is None:
            return jsonify({"error": "role_prompts.json not found"}), 404
        
        # Return full role details with all test information
        roles_data = {}
        for role_name, tests in data.items():
            roles_data[role_name] = {
                "name": role_name,
                "test_count": len(tests),
                "tests": tests  # Include all test details
            }
        
        return jsonify({
            "roles": roles_data,
            "total_roles": len(roles_data),
            "role_names": list(roles_data.keys())
        })
            
    except Exception as e:
        logging.error(f"List roles error: {e}")
        return jsonify({"error": f"Error reading roles: {str(e)}"}), 500

@app.route('/api/roles', methods=['GET'])
def get_roles():
    """API endpoint to get all roles with full details"""
    try:
        data = load_role_prompts()
        if data is None:
            return jsonify({"error": "role_prompts.json not found"}), 404
        
        # Return structured role data with all test details
        roles_list = []
        for role_name, tests in data.items():
            role_info = {
                "name": role_name,
                "test_count": len(tests),
                "tests": tests  # Return all test details as-is from JSON
            }
            roles_list.append(role_info)
        
        return jsonify({
            "roles": roles_list,
            "total_roles": len(roles_list),
            "total_tests": sum(len(r["tests"]) for r in roles_list)
        })
            
    except Exception as e:
        logging.error(f"Get roles error: {e}")
        return jsonify({"error": f"Error reading roles: {str(e)}"}), 500

@app.route('/api/roles/<role_name>', methods=['GET'])
def get_role_detail(role_name):
    """Get detailed information about a specific role"""
    try:
        data = load_role_prompts()
        if data is None:
            return jsonify({"error": "role_prompts.json not found"}), 404
        
        if role_name not in data:
            return jsonify({"error": f"Role '{role_name}' not found"}), 404
        
        tests = data[role_name]
        role_info = {
            "name": role_name,
            "test_count": len(tests),
            "tests": tests  # Return all test details as-is
        }
        
        return jsonify(role_info)
            
    except Exception as e:
        logging.error(f"Get role detail error: {e}")
        return jsonify({"error": f"Error reading role: {str(e)}"}), 500

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "benchmark_script": str(BENCHMARK_SCRIPT_PATH),
        "working_dir": str(WORKING_DIR)
    })

@app.route('/api/performance-matrix')
def performance_matrix():
    """Get aggregated performance by role type"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Get average performance by role
        cur.execute("""
            WITH role_performance AS (
                SELECT 
                    role_type,
                    model_name,
                    AVG(quality_score) as avg_score,
                    AVG(response_time) as avg_time,
                    COUNT(*) as test_count,
                    COUNT(*) FILTER (WHERE success = true) * 100.0 / COUNT(*) as success_rate
                FROM benchmark_results
                WHERE role_type IS NOT NULL
                  AND timestamp > NOW() - INTERVAL '30 days'
                GROUP BY role_type, model_name
            ),
            best_per_role AS (
                SELECT DISTINCT ON (role_type)
                    role_type,
                    model_name,
                    avg_score,
                    avg_time,
                    test_count,
                    success_rate
                FROM role_performance
                ORDER BY role_type, avg_score DESC
            )
            SELECT 
                role_type,
                model_name,
                ROUND(avg_score::numeric, 1) as score,
                ROUND(avg_time::numeric, 1) as time,
                test_count,
                ROUND(success_rate::numeric, 1) as success_rate,
                CASE
                    WHEN avg_score >= 7.5 AND avg_time < 15 THEN 'YES'
                    WHEN avg_score >= 7.0 AND avg_time < 30 THEN 'HYBRID'
                    ELSE 'NO'
                END as status
            FROM best_per_role
            ORDER BY avg_score DESC
        """)
        
        results = cur.fetchall()
        cur.close()
        conn.close()
        
        # Format results
        performance_data = []
        for row in results:
            performance_data.append({
                "task": row[0],  # role_type
                "model": row[1],  # model_name
                "score": float(row[2]),
                "time": float(row[3]),
                "test_count": int(row[4]),
                "success_rate": float(row[5]),
                "status": row[6]
            })
        
        return jsonify({
            "data": performance_data,
            "total_tasks": len(performance_data),
            "local_ready": len([d for d in performance_data if d['status'] == 'YES']),
            "hybrid": len([d for d in performance_data if d['status'] == 'HYBRID']),
            "cloud_only": len([d for d in performance_data if d['status'] == 'NO'])
        })
        
    except Exception as e:
        logging.error(f"Performance matrix error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/benchmarks')
def get_benchmarks():
    """Unified endpoint matching PRD spec"""
    try:
        # Get query params
        models = request.args.getlist('model')
        roles = request.args.getlist('role')
        min_score = request.args.get('minScore', type=float)
        max_score = request.args.get('maxScore', type=float)
        summary_only = request.args.get('summary', 'false').lower() == 'true'
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Build WHERE clause for filters
        where_clauses = ["success = true"]
        params = []
        
        if models:
            placeholders = ','.join(['%s'] * len(models))
            where_clauses.append(f"model_name IN ({placeholders})")
            params.extend(models)
        
        if roles:
            placeholders = ','.join(['%s'] * len(roles))
            where_clauses.append(f"role_type IN ({placeholders})")
            params.extend(roles)
        
        if min_score is not None:
            where_clauses.append("quality_score >= %s")
            params.append(min_score)
        
        if max_score is not None:
            where_clauses.append("quality_score <= %s")
            params.append(max_score)
        
        where_sql = " AND ".join(where_clauses)
        
        # Get summary stats
        cur.execute(f"""
            SELECT 
                COUNT(*) as total_tests,
                COUNT(DISTINCT model_name) as models,
                COUNT(DISTINCT role_type) as roles
            FROM benchmark_results
            WHERE {where_sql}
        """, params)
        summary_row = cur.fetchone()
        
        # Get speed champion
        cur.execute(f"""
            SELECT model_name, AVG(response_time) as avg_time
            FROM benchmark_results
            WHERE {where_sql}
            GROUP BY model_name
            ORDER BY avg_time ASC
            LIMIT 1
        """, params)
        speed_champ = cur.fetchone()
        
        # Get quality champion
        cur.execute(f"""
            SELECT model_name, AVG(quality_score) as avg_score
            FROM benchmark_results
            WHERE {where_sql}
            GROUP BY model_name
            ORDER BY avg_score DESC
            LIMIT 1
        """, params)
        quality_champ = cur.fetchone()
        
        summary = {
            "totalTests": summary_row[0],
            "models": summary_row[1],
            "roles": summary_row[2],
            "speedChampion": {
                "model": speed_champ[0],
                "time": round(float(speed_champ[1]), 1)
            } if speed_champ else None,
            "qualityChampion": {
                "model": quality_champ[0],
                "score": round(float(quality_champ[1]), 1)
            } if quality_champ else None,
            "lastUpdated": datetime.now().isoformat()
        }
        
        if summary_only:
            cur.close()
            conn.close()
            return jsonify({"summary": summary})
        
        # Get matrix data (existing query)
        cur.execute(f"""
            WITH role_performance AS (
                SELECT 
                    role_type,
                    model_name,
                    AVG(quality_score) as avg_score,
                    AVG(response_time) as avg_time,
                    COUNT(*) as test_count
                FROM benchmark_results
                WHERE {where_sql}
                GROUP BY role_type, model_name
            ),
            best_per_role AS (
                SELECT DISTINCT ON (role_type)
                    role_type,
                    model_name,
                    avg_score,
                    avg_time,
                    test_count
                FROM role_performance
                ORDER BY role_type, avg_score DESC
            )
            SELECT 
                role_type,
                model_name,
                ROUND(avg_score::numeric, 1) as score,
                ROUND(avg_time::numeric, 1) as time,
                test_count
            FROM best_per_role
            ORDER BY avg_score DESC
        """, params)
        
        matrix_results = cur.fetchall()
        
        # Get chart data
        # Response times by model
        cur.execute(f"""
            SELECT 
                model_name,
                AVG(response_time) as avg_time
            FROM benchmark_results
            WHERE {where_sql}
            GROUP BY model_name
            ORDER BY avg_time ASC
        """, params)
        response_times = [
            {"model": row[0], "time": round(float(row[1]), 1)}
            for row in cur.fetchall()
        ]
        
        # Quality distribution by model
        cur.execute(f"""
            SELECT 
                model_name,
                AVG(quality_score) as avg_score
            FROM benchmark_results
            WHERE {where_sql}
            GROUP BY model_name
            ORDER BY avg_score DESC
        """, params)
        quality_dist = [
            {"model": row[0], "score": round(float(row[1]), 1)}
            for row in cur.fetchall()
        ]
        
        cur.close()
        conn.close()
        
        # Format matrix
        matrix = []
        for row in matrix_results:
            matrix.append({
                "task": row[0],
                "model": row[1],
                "score": float(row[2]),
                "time": float(row[3]),
                "test_count": int(row[4])
            })
        
        return jsonify({
            "summary": summary,
            "matrix": matrix,
            "chartData": {
                "responseTimes": response_times,
                "qualityDistribution": quality_dist
            }
        })
        
    except Exception as e:
        logging.error(f"Benchmarks error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/benchmarks/<int:benchmark_id>')
def get_benchmark_detail(benchmark_id):
    """Get single benchmark result for modal display"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT 
                id,
                model_name,
                role_type,
                quality_score,
                response_time,
                prompt_text,
                full_response,
                scoring_breakdown
            FROM benchmark_results
            WHERE id = %s
        """, (benchmark_id,))
        
        result = cur.fetchone()
        cur.close()
        conn.close()
        
        if not result:
            return jsonify({"error": "Benchmark not found"}), 404
        
        return jsonify({
            "id": result[0],
            "model": result[1],
            "role": result[2],
            "score": float(result[3]),
            "time": float(result[4]),
            "prompt": result[5],
            "response": result[6],
            "breakdown": result[7]  # Already JSONB
        })
        
    except Exception as e:
        logging.error(f"Benchmark detail error: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # Verify paths exist
    if not BENCHMARK_SCRIPT_PATH.exists():
        logging.error(f"Benchmark script not found: {BENCHMARK_SCRIPT_PATH}")
        exit(1)
    
    if not WORKING_DIR.exists():
        logging.error(f"Working directory not found: {WORKING_DIR}")
        exit(1)
    
    logging.info(f"Starting AI Labs Trigger Server")
    logging.info(f"Benchmark script: {BENCHMARK_SCRIPT_PATH}")
    logging.info(f"Working directory: {WORKING_DIR}")
    
    app.run(host='0.0.0.0', port=5000, debug=False)
