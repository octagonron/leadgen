// This file contains API route modifications to work with standard Next.js deployment
// instead of Cloudflare Workers

import { NextRequest, NextResponse } from 'next/server';

// Mock database for demonstration purposes
// In a production environment, you would use a real database like MongoDB, PostgreSQL, etc.
let mockDB = {
  leads: [],
  keywords: [],
  leadScores: [],
  counters: {
    page_views: 0,
    form_submissions: 0,
    qualified_leads: 0
  }
};

// Initialize with the keywords from user requirements
if (mockDB.keywords.length === 0) {
  mockDB.keywords = [
    { id: 1, keyword: 'make money online', category: 'income', priority: 3 },
    { id: 2, keyword: 'side hustle', category: 'income', priority: 3 },
    { id: 3, keyword: 'remote work', category: 'work_style', priority: 2 },
    { id: 4, keyword: 'freelance writer', category: 'occupation', priority: 1 },
    { id: 5, keyword: 'Uber driver', category: 'occupation', priority: 1 },
    { id: 6, keyword: 'gig worker', category: 'work_style', priority: 2 },
    { id: 7, keyword: 'taskrabbit', category: 'platform', priority: 1 },
    { id: 8, keyword: 'virtual assistant', category: 'occupation', priority: 2 },
    { id: 9, keyword: 'MLM survivor', category: 'experience', priority: 2 },
    { id: 10, keyword: 'work from home', category: 'work_style', priority: 3 },
    { id: 11, keyword: 'cash flow ideas', category: 'income', priority: 2 },
    { id: 12, keyword: 'single mom income', category: 'demographic', priority: 2 },
    { id: 13, keyword: 'no degree jobs', category: 'qualification', priority: 2 },
    { id: 14, keyword: 'digital nomad', category: 'lifestyle', priority: 3 },
    { id: 15, keyword: 'travel affiliate', category: 'travel', priority: 4 },
    { id: 16, keyword: 'how to sell travel', category: 'travel', priority: 5 },
    { id: 17, keyword: 'work from laptop', category: 'work_style', priority: 2 },
    { id: 18, keyword: 'zoom business', category: 'tool', priority: 1 },
    { id: 19, keyword: 'fire your boss', category: 'motivation', priority: 3 },
    { id: 20, keyword: 'financial freedom', category: 'goal', priority: 3 },
    { id: 21, keyword: 'affiliate marketing', category: 'marketing', priority: 3 },
    { id: 22, keyword: 'social media income', category: 'income', priority: 2 },
    { id: 23, keyword: 'business from phone', category: 'tool', priority: 2 },
    { id: 24, keyword: 'side income 2025', category: 'income', priority: 3 },
    { id: 25, keyword: 'bold over 30', category: 'demographic', priority: 2 },
    { id: 26, keyword: 'work from phone', category: 'work_style', priority: 2 },
    { id: 27, keyword: 'online entrepreneur', category: 'identity', priority: 3 },
    { id: 28, keyword: 'black woman in tech', category: 'demographic', priority: 2 },
    { id: 29, keyword: 'introvert business ideas', category: 'personality', priority: 2 },
    { id: 30, keyword: 'residual income', category: 'income', priority: 3 },
    { id: 31, keyword: 'build your team', category: 'team_building', priority: 4 },
    { id: 32, keyword: 'mompreneurs', category: 'demographic', priority: 2 },
    { id: 33, keyword: 'women over 40 income', category: 'demographic', priority: 2 },
    { id: 34, keyword: '$500 a week online', category: 'income', priority: 3 },
    { id: 35, keyword: 'lead generator', category: 'marketing', priority: 2 },
    { id: 36, keyword: 'booking clients fast', category: 'sales', priority: 3 },
    { id: 37, keyword: 'simple sales funnel', category: 'marketing', priority: 2 },
    { id: 38, keyword: 'credit repair leads', category: 'niche', priority: 1 },
    { id: 39, keyword: 'dropshipping 2025', category: 'business_model', priority: 1 },
    { id: 40, keyword: 'AI virtual assistant', category: 'tool', priority: 2 },
    { id: 41, keyword: 'mobile business tools', category: 'tool', priority: 2 },
    { id: 42, keyword: '$79 business startup', category: 'startup', priority: 2 },
    { id: 43, keyword: 'facebook automation leads', category: 'marketing', priority: 2 },
    { id: 44, keyword: 'tiktok business coaching', category: 'marketing', priority: 2 },
    { id: 45, keyword: 'travelpreneur', category: 'travel', priority: 5 },
    { id: 46, keyword: 'sell travel online', category: 'travel', priority: 5 },
    { id: 47, keyword: 'team building funnel', category: 'team_building', priority: 4 },
    { id: 48, keyword: 'go getters', category: 'personality', priority: 5 }
  ];
}

// Helper functions for the mock database
function getNextId(collection) {
  if (mockDB[collection].length === 0) return 1;
  return Math.max(...mockDB[collection].map(item => item.id)) + 1;
}

function getCurrentTimestamp() {
  return new Date().toISOString();
}

// API routes
export async function GET(request) {
  return NextResponse.json({
    keywords: mockDB.keywords
  });
}

export async function POST(request) {
  try {
    // Parse the request body
    const { keyword, category, priority } = await request.json();
    
    // Basic validation
    if (!keyword || !category) {
      return NextResponse.json(
        { error: 'Keyword and category are required' },
        { status: 400 }
      );
    }
    
    // Check if keyword already exists
    const existingKeyword = mockDB.keywords.find(k => k.keyword === keyword);
    
    if (existingKeyword) {
      return NextResponse.json(
        { error: 'Keyword already exists' },
        { status: 400 }
      );
    }
    
    // Insert new keyword
    const newKeyword = {
      id: getNextId('keywords'),
      keyword,
      category,
      priority: priority || 3,
      created_at: getCurrentTimestamp()
    };
    
    mockDB.keywords.push(newKeyword);
    
    return NextResponse.json({
      success: true,
      message: 'Keyword added successfully',
      keywordId: newKeyword.id
    });
    
  } catch (error) {
    console.error('Error adding keyword:', error);
    return NextResponse.json(
      { error: 'Failed to add keyword' },
      { status: 500 }
    );
  }
}
