import { NextRequest, NextResponse } from 'next/server';
import ogs from 'open-graph-scraper';

export async function GET(request: NextRequest) {
  try {
    // Test with the Substack URL that's failing
    const testUrl = 'https://substack.com'; // We'll use this as a test
    
    const options = {
      url: testUrl,
      timeout: 10000,
      retry: 2,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BookmarkBot/1.0)',
      },
    };

    const { error, result } = await ogs(options);

    if (error) {
      console.error('OG scraping error:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch metadata',
        error: error,
        testUrl,
      });
    }

    const metadata = {
      title: result.ogTitle || result.twitterTitle || result.dcTitle || '',
      description: result.ogDescription || result.twitterDescription || result.dcDescription || '',
      image: result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url || '',
      siteName: result.ogSiteName || '',
      type: result.ogType || 'website',
      url: result.ogUrl || testUrl,
      rawResult: result, // Include raw result for debugging
    };

    return NextResponse.json({
      success: true,
      data: metadata,
      testUrl,
      message: 'Test metadata fetch successful',
    });

  } catch (error) {
    console.error('Error in test metadata:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to test metadata',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 