from flask import Flask, jsonify, request
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

app = Flask(__name__)
CORS(app)

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "success",
        "message": "Expense Tracker API with Firebase connected"
    }), 200


@app.route("/expenses", methods=["POST"])
def add_expense():
    data = request.json

    if not data:
        return jsonify({"error": "No data provided"}), 400

    expense = {
        "title": data.get("title"),
        "amount": data.get("amount"),
        "category": data.get("category"),
        "createdAt": datetime.utcnow()
    }

    doc_ref = db.collection("expenses").add(expense)

    return jsonify({
        "message": "Expense added successfully",
        "id": doc_ref[1].id
    }), 201


@app.route("/expenses", methods=["GET"])
def get_expenses():
    expenses_ref = db.collection("expenses").stream()

    expenses = []
    for doc in expenses_ref:
        expense = doc.to_dict()
        expense["id"] = doc.id
        expenses.append(expense)

    return jsonify(expenses), 200


@app.route("/expenses/<expense_id>", methods=["PUT"])
def update_expense(expense_id):
    data = request.json

    if not data:
        return jsonify({"error": "No data provided"}), 400

    db.collection("expenses").document(expense_id).update({
        "title": data.get("title"),
        "amount": data.get("amount"),
        "category": data.get("category")
    })

    return jsonify({"message": "Expense updated successfully"}), 200



@app.route("/expenses/<expense_id>", methods=["DELETE"])
def delete_expense(expense_id):
    db.collection("expenses").document(expense_id).delete()

    return jsonify({"message": "Expense deleted successfully"}), 200


if __name__ == "__main__":
    app.run(debug=True)
