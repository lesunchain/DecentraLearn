import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
import pandas as pd

# Load the CSV
df = pd.read_csv("vectors.csv")

# Extract only the numerical columns (skip 'id')
data = df.iloc[:, 1:].to_numpy()

# Reduce to 2D using PCA
pca = PCA(n_components=2)
transformed = pca.fit_transform(data)

# Scatter Plot
plt.figure(figsize=(8, 6))
plt.scatter(transformed[:, 0], transformed[:, 1], c='blue', alpha=0.7)
plt.xlabel("PCA Component 1")
plt.ylabel("PCA Component 2")
plt.title("2D Vector Visualization")
plt.show()
