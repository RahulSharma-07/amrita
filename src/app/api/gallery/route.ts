import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Gallery } from '@/models';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limitParams = searchParams.get('limit');

    const query: Record<string, unknown> = {};
    if (category && category !== 'all') {
      query.category = category;
    }

    // If limit is not provided, fetch all (for admin panel)
    if (!limitParams) {
      const allAlbums = await Gallery.find(query).sort({ eventDate: -1, createdAt: -1 });

      const formatted = allAlbums.map(album => ({
        _id: album._id.toString(),
        name: album.albumName,
        category: album.category,
        description: album.description,
        coverImage: album.coverImage,
        images: album.images?.map((img: any) => img.url) || [],
        createdAt: album.createdAt,
      }));

      return NextResponse.json(formatted);
    }

    const limit = parseInt(limitParams || '12');
    const skip = (page - 1) * limit;

    const [albums, total] = await Promise.all([
      Gallery.find({ ...query, isActive: true })
        .sort({ eventDate: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v'),
      Gallery.countDocuments({ ...query, isActive: true }),
    ]);

    return NextResponse.json({
      albums,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Get gallery error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (body.type === 'replace_all') {
      await Gallery.deleteMany({});

      const newAlbums = body.albums.map((al: any, i: number) => ({
        albumName: al.name,
        category: al.category,
        description: al.description,
        coverImage: al.coverImage,
        images: al.images?.map((url: string, index: number) => ({
          url,
          publicId: `legacy-${Date.now()}-${index}`,
          order: index
        })) || [],
        isActive: true,
        createdAt: al.createdAt || new Date(),
        eventDate: new Date(),
      }));

      const results = await Gallery.insertMany(newAlbums);

      const formatted = results.map(album => ({
        _id: album._id.toString(),
        name: album.albumName,
        category: album.category,
        description: album.description,
        coverImage: album.coverImage,
        images: album.images?.map((img: any) => img.url) || [],
        createdAt: album.createdAt,
      }));

      return NextResponse.json({ success: true, albums: formatted });
    }

    return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
  } catch (error) {
    console.error('Post gallery error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
