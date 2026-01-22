const natural = require('natural');
const sw = require('stopword');
const stringSimilarity = require('string-similarity');

class NLPMatcher {
  constructor() {
    this.TfIdf = natural.TfIdf;
    this.stemmer = natural.PorterStemmer;
  }

  // NLP Text Preprocessing
  preprocessText(text) {
    if (!text) return [];
    
    // Convert to lowercase and remove special characters
    const cleaned = text.toLowerCase().replace(/[^\w\s]/g, ' ');
    
    // Tokenize into words
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(cleaned);
    
    // Remove stop words
    const withoutStopWords = sw.removeStopwords(tokens);
    
    // Apply stemming
    const stemmed = withoutStopWords.map(word => this.stemmer.stem(word));
    
    // Filter out short words
    return stemmed.filter(word => word.length > 2);
  }

  // TF-IDF Algorithm Implementation
  calculateTFIDF(resumeText, jobText) {
    const tfidf = new this.TfIdf();
    
    // Add documents to TF-IDF
    tfidf.addDocument(this.preprocessText(resumeText));
    tfidf.addDocument(this.preprocessText(jobText));
    
    // Get TF-IDF vectors
    const resumeVector = [];
    const jobVector = [];
    
    // Get all terms
    const allTerms = new Set();
    tfidf.listTerms(0).forEach(item => allTerms.add(item.term));
    tfidf.listTerms(1).forEach(item => allTerms.add(item.term));
    
    // Build vectors
    [...allTerms].forEach(term => {
      resumeVector.push(tfidf.tfidf(term, 0));
      jobVector.push(tfidf.tfidf(term, 1));
    });
    
    return { resumeVector, jobVector, terms: [...allTerms] };
  }

  // Cosine Similarity Calculation
  cosineSimilarity(vectorA, vectorB) {
    if (vectorA.length !== vectorB.length || vectorA.length === 0) return 0;
    
    const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));
    
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    
    return dotProduct / (magnitudeA * magnitudeB);
  }

  // Main Matching Function
  calculateAdvancedMatch(resumeText, jobDescription) {
    try {
      // Step 1: TF-IDF Analysis
      const { resumeVector, jobVector, terms } = this.calculateTFIDF(resumeText, jobDescription);
      
      // Step 2: Cosine Similarity
      const tfidfSimilarity = this.cosineSimilarity(resumeVector, jobVector);
      
      // Step 3: String Similarity (backup method)
      const stringSim = stringSimilarity.compareTwoStrings(resumeText, jobDescription);
      
      // Step 4: Skills Matching
      const resumeTerms = this.preprocessText(resumeText);
      const jobTerms = this.preprocessText(jobDescription);
      const skillsMatch = this.calculateSkillsOverlap(resumeTerms, jobTerms);
      
      // Step 5: Combined Score (weighted average)
      const overallScore = (tfidfSimilarity * 0.5) + (stringSim * 0.3) + (skillsMatch * 0.2);
      
      return {
        overallMatch: Math.round(overallScore * 100),
        tfidfSimilarity: Math.round(tfidfSimilarity * 100),
        stringSimilarity: Math.round(stringSim * 100),
        skillsMatch: Math.round(skillsMatch * 100),
        matchedTerms: this.getTopMatchedTerms(resumeVector, jobVector, terms),
        analysis: this.generateAnalysis(overallScore)
      };
    } catch (error) {
      console.error('NLP matching error:', error);
      return {
        overallMatch: 0,
        tfidfSimilarity: 0,
        stringSimilarity: 0,
        skillsMatch: 0,
        matchedTerms: [],
        analysis: 'Error in NLP analysis'
      };
    }
  }

  // Calculate Skills Overlap (Jaccard Similarity)
  calculateSkillsOverlap(resumeTerms, jobTerms) {
    const resumeSet = new Set(resumeTerms);
    const jobSet = new Set(jobTerms);
    const intersection = new Set([...resumeSet].filter(x => jobSet.has(x)));
    const union = new Set([...resumeSet, ...jobSet]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  // Get Top Matched Terms
  getTopMatchedTerms(resumeVector, jobVector, terms) {
    const termScores = terms.map((term, i) => ({
      term,
      score: resumeVector[i] * jobVector[i]
    }));
    
    return termScores
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(item => item.term);
  }

  // Generate Analysis Text
  generateAnalysis(score) {
    if (score > 0.7) return 'Excellent match with strong NLP similarity';
    if (score > 0.5) return 'Good match with decent semantic alignment';
    if (score > 0.3) return 'Moderate match with some relevant content';
    return 'Limited match based on NLP analysis';
  }
}

module.exports = new NLPMatcher();