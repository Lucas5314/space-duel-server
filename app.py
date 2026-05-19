from flask import Flask, render_template, jsonify
import psycopg2

app = Flask(__name__)

# conexión postgres
conn = psycopg2.connect(
    host="localhost",
    database="paraguay",
    user="postgres",
    password="TU_PASSWORD",
    port="5432"
)

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/roads')
def roads():

    cur = conn.cursor()

    cur.execute("""
        SELECT
            surface,
            ST_AsGeoJSON(way)
        FROM planet_osm_line
        WHERE highway IS NOT NULL
        LIMIT 3000;
    """)

    rows = cur.fetchall()

    data = []

    for surface, geojson in rows:
        data.append({
            "surface": surface,
            "geometry": geojson
        })

    cur.close()

    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)