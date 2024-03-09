import pandas as pd
import numpy as np
import pickle
import gzip

def cosine_similarity(u, v):
    norm_u = np.linalg.norm(u)
    norm_v = np.linalg.norm(v)

    # Handle zero-vector cases to avoid division by zero
    if norm_u == 0 or norm_v == 0:
        return 0
    
    cosine_similarity = np.dot(u, v) / (norm_u * norm_v)
    return cosine_similarity

# Load model
with gzip.open("svd_model.h5", 'rb') as f:
    p = pickle.Unpickler(f)
    model = p.load()

def get_vector(raw_id, trained_model=model) -> np.array:
    """Returns the latent features of a book in the form of a numpy array"""
    book_row_idx = trained_model.trainset._raw2inner_id_items[raw_id]
    return trained_model.qi[book_row_idx]

def get_recs(book_id, model=model) -> pd.DataFrame:
    """Returns the top 25 most similar books to a specified book
    
    This function iterates over every possible book in dataset and calculates
    distance between `book id` vector and that book's vector.
    """

    # Get the first book vector
    book_vector = get_vector(book_id, model)
    similarity_table = []
    
    # Iterate over every possible book and calculate similarity
    for other_raw_id in model.trainset._raw2inner_id_items.keys():
        other_book_vector = get_vector(other_raw_id, model)
        
        # Get the second book vector, and calculate distance
        similarity_score = cosine_similarity(other_book_vector, book_vector)
        
        if book_id != other_raw_id:
            similarity_table.append((similarity_score, other_raw_id))

    # sort books by ascending similarity
    recs = pd.DataFrame(sorted(similarity_table), columns=["vector_cosine_distance", "book_id"])

    return recs.tail(25)[::-1]
