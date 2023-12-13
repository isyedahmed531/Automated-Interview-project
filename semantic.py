import nltk
from sklearn.metrics.pairwise import cosine_similarity
import torch
from transformers import BertTokenizer, BertModel

nltk.download('punkt')

def load_word_embeddings():
    # Load pre-trained BERT word embeddings
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    model = BertModel.from_pretrained('bert-base-uncased')

    def get_sentence_embedding(sentence):
        inputs = tokenizer(sentence, return_tensors='pt', truncation=True, padding=True)
        with torch.no_grad():
            outputs = model(**inputs)
        return outputs.last_hidden_state.mean(dim=1).squeeze().numpy()

    return get_sentence_embedding

def calculate_semantic_similarity(text1, text2, sentence_embedding_function):
    # Get sentence embeddings
    sentence_embedding1 = sentence_embedding_function(text1)
    sentence_embedding2 = sentence_embedding_function(text2)

    if sentence_embedding1 is not None and sentence_embedding2 is not None:
        # Calculate cosine similarity between sentence embeddings
        similarity = cosine_similarity([sentence_embedding1], [sentence_embedding2])[0][0]

        # Return the similarity as a percentage
        return similarity * 100

    # If sentence embeddings are None, return -1 to indicate an error
    return -1

# Example usage:
# if __name__ == "__main__":
#     sentence_embedding_function = load_word_embeddings()
#     text1 = "I am happy"
#     text2 = "I'm not sad but glad"
#     similarity_percentage = calculate_semantic_similarity(text1, text2, sentence_embedding_function)
#     print(f"Similarity percentage: {similarity_percentage:.2f}%")
