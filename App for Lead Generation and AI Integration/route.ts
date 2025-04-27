import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@cloudflare/next-on-pages';

// Define the lead data interface
interface LeadData {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  currentOccupation?: string;
  experienceLevel: string;
  interests: string[];
  motivationLevel: number;
  source?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const leadData: LeadData = await request.json();
    
    // Basic validation
    if (!leadData.name || !leadData.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    // Get Cloudflare context for database access
    const { env } = getCloudflareContext();
    const db = env.DB;
    
    if (!db) {
      console.error('Database not available');
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 500 }
      );
    }
    
    // Insert lead into database
    const result = await db.prepare(
      `INSERT INTO leads (name, email, phone, location, current_occupation, experience_level, motivation_level, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      leadData.name,
      leadData.email,
      leadData.phone || null,
      leadData.location || null,
      leadData.currentOccupation || null,
      leadData.experienceLevel,
      leadData.motivationLevel,
      leadData.source || null
    )
    .run();
    
    if (!result.success) {
      throw new Error('Failed to insert lead');
    }
    
    // Get the inserted lead ID
    const leadIdResult = await db.prepare(
      `SELECT id FROM leads WHERE email = ? ORDER BY created_at DESC LIMIT 1`
    )
    .bind(leadData.email)
    .first();
    
    if (!leadIdResult) {
      throw new Error('Failed to retrieve lead ID');
    }
    
    const leadId = leadIdResult.id;
    
    // Process interests
    if (leadData.interests && leadData.interests.length > 0) {
      for (const interest of leadData.interests) {
        // Get keyword ID
        const keywordResult = await db.prepare(
          `SELECT id FROM keywords WHERE keyword = ? OR keyword LIKE ?`
        )
        .bind(interest, `%${interest}%`)
        .first();
        
        if (keywordResult) {
          // Insert lead interest
          await db.prepare(
            `INSERT INTO lead_interests (lead_id, keyword_id, interest_level)
             VALUES (?, ?, ?)`
          )
          .bind(leadId, keywordResult.id, 3) // Default interest level
          .run();
        }
      }
    }
    
    // Calculate initial lead score
    const goGetterScore = leadData.motivationLevel * 20; // Scale to 0-100
    const travelInterestScore = leadData.interests.includes('travel_sales') ? 80 : 
                               (leadData.interests.includes('digital_nomad') ? 60 : 40);
    const salesAptitudeScore = leadData.experienceLevel === 'expert' ? 100 :
                              leadData.experienceLevel === 'experienced' ? 80 :
                              leadData.experienceLevel === 'some_experience' ? 60 : 40;
    
    const totalScore = Math.round((goGetterScore + travelInterestScore + salesAptitudeScore) / 3);
    
    // Insert lead score
    await db.prepare(
      `INSERT INTO lead_scores (lead_id, total_score, go_getter_score, travel_interest_score, sales_aptitude_score)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(leadId, totalScore, goGetterScore, travelInterestScore, salesAptitudeScore)
    .run();
    
    // Update counter
    await db.prepare(
      `UPDATE counters SET value = value + 1 WHERE name = 'form_submissions'`
    )
    .run();
    
    // If score is high, update qualified leads counter
    if (totalScore >= 70) {
      await db.prepare(
        `UPDATE counters SET value = value + 1 WHERE name = 'qualified_leads'`
      )
      .run();
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Lead successfully captured',
      leadId,
      score: totalScore
    });
    
  } catch (error) {
    console.error('Error processing lead:', error);
    return NextResponse.json(
      { error: 'Failed to process lead information' },
      { status: 500 }
    );
  }
}
