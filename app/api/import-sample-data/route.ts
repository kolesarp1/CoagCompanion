import { createClient } from '@/lib/supabase/server';
import { parseSeedData } from '@/lib/toml-parser';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createClient();

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get sample data
    const sampleLogs = parseSeedData();

    // Transform logs to database format
    const dbLogs = sampleLogs.map(log => ({
      user_id: user.id,
      date: log.date,
      lab_inr: log.labINR ?? null,
      home_inr: log.homeINR ?? null,
      warfarin_dose: log.warfarinDose ?? null,
      injections: log.injections ?? null,
      comment: log.comment ?? null,
      vitamin_k_intake: log.vitaminKIntake ?? null,
    }));

    // Insert all sample logs
    const { error: insertError } = await supabase
      .from('logs')
      .insert(dbLogs);

    if (insertError) {
      console.error('Error inserting sample data:', insertError);
      return NextResponse.json(
        { error: 'Failed to import sample data', details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${sampleLogs.length} sample log entries`,
      count: sampleLogs.length
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
