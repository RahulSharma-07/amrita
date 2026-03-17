import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { HeroSlider } from '@/models';

// GET - Fetch hero slider data
export async function GET() {
  try {
    await connectDB();
    const slides = await HeroSlider.find().sort({ displayOrder: 1 });

    const formattedSlides = slides.map((slide) => ({
      id: slide._id.toString(),
      imageUrl: slide.imageUrl,
      title: slide.title,
      subtitle: slide.subtitle,
      buttonText: slide.buttonText,
      buttonLink: slide.buttonLink,
      displayOrder: slide.displayOrder,
      status: slide.isActive ? 'active' : 'inactive',
      createdAt: slide.createdAt,
      updatedAt: slide.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: formattedSlides,
      count: formattedSlides.length
    });
  } catch (error: any) {
    console.error('❌ Error fetching hero slides:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch hero slides' },
      { status: 500 }
    );
  }
}

// POST - Save hero slider data
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { slides } = body;

    // Validate input
    if (!slides || !Array.isArray(slides)) {
      return NextResponse.json(
        { success: false, error: 'Invalid slides data' },
        { status: 400 }
      );
    }

    // Validate each slide
    for (const slide of slides) {
      if (!slide.title || !slide.subtitle || !slide.buttonText) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields in slide' },
          { status: 400 }
        );
      }
    }

    // Since admin saves all active slides together, we can replace them
    await HeroSlider.deleteMany({});

    const slidesToInsert = slides.map((slide, index) => ({
      title: slide.title,
      subtitle: slide.subtitle,
      imageUrl: slide.imageUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200',
      publicId: slide.publicId || `public-${Date.now()}-${index}`,
      buttonText: slide.buttonText || 'Apply Now',
      buttonLink: slide.buttonLink || '/admission',
      displayOrder: slide.displayOrder || index + 1,
      isActive: slide.status === 'active' || !slide.status ? true : false,
      createdAt: slide.createdAt || new Date(),
    }));

    const insertedSlides = await HeroSlider.insertMany(slidesToInsert);

    const formattedSlides = insertedSlides.map((slide) => ({
      id: slide._id.toString(),
      imageUrl: slide.imageUrl,
      title: slide.title,
      subtitle: slide.subtitle,
      buttonText: slide.buttonText,
      buttonLink: slide.buttonLink,
      displayOrder: slide.displayOrder,
      status: slide.isActive ? 'active' : 'inactive',
      createdAt: slide.createdAt,
      updatedAt: slide.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      message: `Successfully saved ${formattedSlides.length} slides`,
      data: formattedSlides,
      count: formattedSlides.length
    });

  } catch (error) {
    console.error('❌ Error saving hero slides:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save hero slides' },
      { status: 500 }
    );
  }
}
