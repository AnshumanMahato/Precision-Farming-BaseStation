import os
import sys
import pickle
import numpy as np
import pandas as pd
import json
import warnings
from sklearn.exceptions import InconsistentVersionWarning

# Optional: Suppress version warnings if you're confident it's safe
warnings.filterwarnings("ignore", category=InconsistentVersionWarning)

# Define feature names (used during model training)
feature_names = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]

# Load saved model, scaler, and label encoder

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Paths to the model, scaler, and label encoder
model_path = os.path.join(BASE_DIR, "model.pkl")
scaler_path = os.path.join(BASE_DIR, "scaler.pkl")
label_encoder_path = os.path.join(BASE_DIR, "label_encoder.pkl")

with open(model_path, "rb") as f:
    model = pickle.load(f)

with open(scaler_path, "rb") as f:
    scaler = pickle.load(f)

with open(label_encoder_path, "rb") as f:
    label_encoder = pickle.load(f)

# Read input from Node.js and validate
try:
    if len(sys.argv) != 8:
        raise ValueError("Expected 7 input arguments: N, P, K, temperature, humidity, ph, rainfall")

    input_values = list(map(float, sys.argv[1:]))  # Convert input to floats
    input_df = pd.DataFrame([input_values], columns=feature_names)

    # Scale input
    input_scaled = scaler.transform(input_df)

    # Predict probabilities
    probabilities = model.predict_proba(input_scaled)[0]

    # Top 3 predictions
    top_indices = np.argsort(probabilities)[-3:][::-1]
    top_crops = label_encoder.inverse_transform(top_indices)
    top_probs = probabilities[top_indices]

    # Prepare output
    output = [{"crop": crop, "probability": round(prob, 4)} for crop, prob in zip(top_crops, top_probs)]

    print(json.dumps(output))

except Exception as e:
    print(json.dumps({"error": str(e)}))
