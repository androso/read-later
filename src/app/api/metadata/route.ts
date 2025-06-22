import { NextRequest, NextResponse } from 'next/server';
import ogs from 'open-graph-scraper';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { success: false, message: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Fetch Open Graph data
    const options = {
      url,
      timeout: 10000, // 10 second timeout
      retry: 2,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BookmarkBot/1.0)',
      },
    };

    const { error, result } = await ogs(options);

    if (error) {
      console.error('OG scraping error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch metadata' },
        { status: 500 }
      );
    }

    // Extract relevant data
    const metadata = {
      title: result.ogTitle || result.twitterTitle || result.dcTitle || '',
      description: result.ogDescription || result.twitterDescription || result.dcDescription || '',
      image: result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url || '',
      siteName: result.ogSiteName || '',
      type: result.ogType || 'website',
      url: result.ogUrl || url,
    };

    return NextResponse.json({
      success: true,
      data: metadata,
    });

  } catch (error) {
    console.error('Error fetching metadata:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch metadata',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 