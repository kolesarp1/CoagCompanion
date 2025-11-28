import { createClient } from '@/lib/supabase/server';
import { parseSeedData } from '@/lib/toml-parser';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('Starting sample data import...');

    const supabase = await createClient();
    console.log('Supabase client created');

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('User fetch result:', { user: user?.id, error: userError });

    if (userError || !user) {
      console.error('Auth error:', userError);
      return NextResponse.json(
        { error: 'Unauthorized', details: userError?.message },
        { status: 401 }
      );
    }

    // Get sample data
    console.log('Parsing seed data...');
    const sampleLogs = parseSeedData();
    console.log(`Parsed ${sampleLogs.length} sample logs`);

    // Transform logs to database format
    const dbLogs = sampleLogs.map(log => ({
      user_id: user.id,
      date: log.date,
      lab_inr: log.labINR ?? null,
      home_inr: log.homeINR ?? null,
      warfarin_dose: log.warfarinDose ? Math.round(log.warfarinDose) : null,
      injections: log.injections ?? null,
      comment: log.comment ?? null,
      vitamin_k_intake: log.vitaminKIntake ?? null,
    }));

    console.log('Inserting logs into database...');

    // Insert all sample logs
    const { error: insertError, data } = await supabase
      .from('logs')
      .insert(dbLogs)
      .select();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to import sample data', details: insertError.message, code: insertError.code },
        { status: 500 }
      );
    }

    console.log(`Successfully inserted ${data?.length || sampleLogs.length} logs`);

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${sampleLogs.length} sample log entries`,
      count: sampleLogs.length
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}
