import pandas as pd
import numpy as np
import pickle
import gzip
from rsvd import RSVD

books = pd.read_csv("./input/books.csv")

def cosine_similarity(u, v):
    norm_u = np.linalg.norm(u)
    norm_v = np.linalg.norm(v)

    # Handle zero-vector cases to avoid division by zero
    if norm_u == 0 or norm_v == 0:
        return 0
    cosine_similarity = np.dot(u, v) / (norm_u * norm_v)
    return cosine_similarity

# Load model
with gzip.open("rsvd_model.pkl.gz", 'rb') as f:
    p = pickle.Unpickler(f)
    model = p.load()

def get_vector(raw_id, trained_model=model) -> np.array:
    """Returns the latent features of a book in the form of a numpy array"""
    book_row_idx = trained_model.trainset._raw2inner_id_items[raw_id]
    return trained_model.qi[book_row_idx]

def get_book_recs(book_id, model=model) -> pd.DataFrame:
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

def get_user_recs(user_id, rated_book_ids, model=model) -> pd.DataFrame:
    """Returns the top 25 most rated books to a specified user 
    
    This function iterates over every possible book in dataset and find the rating
    estimation for the user.
    """
    rec_ids = []
    rec_ests = []
    
    # Get user inner id
    user_row_idx = model.trainset.to_inner_uid(user_id)
    # Iterate over every possible book and find rating est 
    for index, book in books.iterrows():
        try:
            # Get book inner id
            book_row_idx = model.trainset.to_inner_iid(book["id"])
            est = model.estimate(user_row_idx, book_row_idx)
            rec_ids.append(book["id"])
            rec_ests.append(est)
        except:
            continue
    
    recs = pd.DataFrame({ "book_id": rec_ids, "est": rec_ests })
    recs = recs[~recs.book_id.isin(rated_book_ids)]
    return recs.sort_values(by="est", ascending=False).head(25)
