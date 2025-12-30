from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Set
import nltk
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk import pos_tag
import re
from collections import Counter

# Ensure NLTK data is loaded
def download_nltk_resources():
    resources = [
        'punkt', 'punkt_tab', 'wordnet', 'omw-1.4', 
        'stopwords', 'averaged_perceptron_tagger', 'averaged_perceptron_tagger_eng'
    ]
    for res in resources:
        try:
            nltk.data.find(f'tokenizers/{res}' if 'punkt' in res else f'corpora/{res}' if res in ['wordnet', 'stopwords'] else f'help/{res}')
        except LookupError:
            try:
                nltk.download(res, quiet=True)
            except:
                pass

download_nltk_resources()

# Initialize NLP tools
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

# Custom Recruitment Stopwords (Noise filter)
RECRUITMENT_STOPWORDS = {
    'experience', 'knowledge', 'understanding', 'familiarity', 'proficiency', 
    'year', 'years', 'work', 'working', 'used', 'using', 'strong', 
    'proven', 'track', 'record', 'ability', 'able', 'skill', 'skills', 
    'excellent', 'good', 'communication', 'team', 'member', 'player', 
    'environment', 'fastpaced', 'candidate', 'degree', 'bachelor', 
    'master', 'responsible', 'duty', 'duties', 'role', 'job', 'description',
    'requirement', 'requirements', 'qualification', 'qualifications',
    'basic', 'advanced', 'proficient', 'intermediate', 'hands-on', 
    'demonstrated', 'plus', 'preferred', 'framework', 'frameworks', 
    'tool', 'tools', 'platform', 'platforms', 'end', 'build', 'maintain',
    'develop', 'design', 'implement', 'support', 'create', 'environment',
    'friendly', 'js', 'api', 'apis', 'looking', 'ideal', 'must', 'hiring',
    'wanted', 'seek', 'seeking', 'senior', 'junior', # Senior/Junior are often titles not skills
    'development', 'opportunity', 'opportunities', 'awareness', 'best', 
    'worst', 'coding', 'collaborate', 'collaboration', 'ensure', 'ensuring', 
    'stack', 'full', 'course', 'engineering', 'engineer', 'developer',
    'candidate', 'team', 'work', 'working', 'help', 'learn', 'learning',
    'grow', 'growth', 'passion', 'passionate', 'driven', 'detail', 'oriented'
}

# Combine stopwords
ALL_STOPWORDS = stop_words.union(RECRUITMENT_STOPWORDS)

def get_word_pos(tag):
    if tag.startswith('J'):
        return 'a' # Adjective
    elif tag.startswith('V'):
        return 'v' # Verb
    elif tag.startswith('N'):
        return 'n' # Noun
    elif tag.startswith('R'):
        return 'r' # Adverb
    else:
        return 'n' # Default to Noun

def preprocess_text(text: str, return_mapping: bool = False):
    """
    Advanced preprocessing:
    1. Tokenize
    2. Remove stopwords & special chars
    3. POS Tagging (Keep Nouns/Adjectives mostly)
    4. Lemmatize
    """
    if not text:
        return "" if not return_mapping else ("", {})

    # Lowercase and clean
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', ' ', text) # Replace special chars with space
    
    tokens = word_tokenize(text)
    
    # 1. Filter stopwords first to reduce POS tagging load
    tokens = [t for t in tokens if t not in ALL_STOPWORDS and len(t) > 1]
    
    # 2. POS Tagging
    tagged = pos_tag(tokens)
    
    cleaned_tokens = []
    lemma_to_original = {}

    for word, tag in tagged:
        # Keep Nouns (NN), Adjectives (JJ), Proper Nouns (NNP)
        # Filter out Verbs (VB) unless they are gerunds acting as nouns? 
        # For simplicity in skillset extract, primarily Nouns are technical skills (Python, Java, SQL)
        if tag.startswith('N') or tag.startswith('J') or tag == 'VBG': 
            pos = get_word_pos(tag)
            lemma = lemmatizer.lemmatize(word, pos=pos)
            
            # Double check lemma against stopwords (e.g. 'working' -> 'work' which is stopword)
            if lemma not in ALL_STOPWORDS:
                cleaned_tokens.append(lemma)
                
                # Store mapping: lemma -> most representative original word
                # We'll simplisticly overwrite or keep list. Overwrite is fine for extraction.
                lemma_to_original[lemma] = word

    processed_text = " ".join(cleaned_tokens)
    
    if return_mapping:
        return processed_text, lemma_to_original
    return processed_text

def calculate_match_score(resume_text: str, jd_text: str) -> float:
    if not resume_text or not jd_text:
        return 0.0

    clean_resume = preprocess_text(resume_text)
    clean_jd = preprocess_text(jd_text)
    
    if not clean_resume or not clean_jd:
        return 0.0

    documents = [clean_resume, clean_jd]
    tfidf = TfidfVectorizer()
    
    try:
        tfidf_matrix = tfidf.fit_transform(documents)
        similarity_matrix = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
        score = similarity_matrix[0][0] * 100
        return round(score, 2)
    except:
        return 0.0

def extract_keywords(text: str, top_n: int = 15) -> List[str]:
    """
    Extract top keywords using TF-IDF on lemmatized text, 
    but return the ORIGINAL readable word.
    """
    if not text:
        return []
        
    clean_text, mapping = preprocess_text(text, return_mapping=True)
    
    if not clean_text:
        return []

    tfidf = TfidfVectorizer()
    try:
        tfidf_matrix = tfidf.fit_transform([clean_text])
        feature_names = tfidf.get_feature_names_out()
        
        dense = tfidf_matrix.todense()
        episode = dense[0].tolist()[0]
        
        phrase_scores = [pair for pair in zip(range(0, len(episode)), episode) if pair[1] > 0]
        sorted_phrase_scores = sorted(phrase_scores, key=lambda t: t[1] * -1)
        
        keywords = []
        for phrase_idx, score in sorted_phrase_scores[:top_n]:
            lemma = feature_names[phrase_idx]
            # Map back to original word if possible, else use lemma
            original = mapping.get(lemma, lemma)
            keywords.append(original)
            
        return keywords
    except:
        return []

def find_missing_keywords(resume_text: str, jd_text: str) -> List[str]:
    """
    Identify skills in JD (cleaned) that are missing from Resume (cleaned).
    """
    # 1. Process both
    resume_clean, _ = preprocess_text(resume_text, return_mapping=True)
    jd_clean, jd_mapping = preprocess_text(jd_text, return_mapping=True)
    
    resume_tokens = set(resume_clean.split())
    
    # 2. Get top important words from JD using TF-IDF
    tfidf = TfidfVectorizer()
    try:
        tfidf_matrix = tfidf.fit_transform([jd_clean])
        feature_names = tfidf.get_feature_names_out()
        
        dense = tfidf_matrix.todense()
        episode = dense[0].tolist()[0]
        
        phrase_scores = [pair for pair in zip(range(0, len(episode)), episode) if pair[1] > 0]
        sorted_phrases = sorted(phrase_scores, key=lambda t: t[1] * -1)[:20] # Check top 20
        
        missing = []
        for phrase_idx, score in sorted_phrases:
            lemma = feature_names[phrase_idx]
            if lemma not in resume_tokens:
                # Return the readable word from JD
                original = jd_mapping.get(lemma, lemma)
                missing.append(original)
                
        return missing
    except Exception as e:
        print(f"Error finding missing: {e}")
        return []
