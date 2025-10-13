'use client';

import React from 'react';
import Image from 'next/image';

import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '~/shared/shadcn/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/shared/shadcn/card';
import { Input } from '~/shared/shadcn/input';

import { BannerCarousel } from '~/components/admin-dashboard/banner-carousal';
import { queryClient, trpcHttp } from '~/utils/trpc';

interface BannerUploadResponse {
  uploadUrl: string;
  fileKey: string;
  s3Url: string;
}

interface BannerCreatePayload {
  imageUrl: string;
  fileKey: string;
  websiteUrl: string | undefined;
}
function BannersPage() {
  const [newImageFile, setNewImageFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [newWebsiteLink, setNewWebsiteLink] = React.useState('');

  // calling the backend to get all the banners
  const {
    data: bannerData,
    isLoading: isLoadingBanners,
    refetch: refetchBanners
  } = useQuery(trpcHttp.banner.getAllBanners.queryOptions());

  const banners =
    bannerData?.banners.map((b) => ({
      image_url: b.imageUrl,
      website_link: b.websiteUrl || '#',
      id: b.id,
      alt: `Banner for ${b.websiteUrl || 'Promotion'}`
    })) || [];

  // calling backend to store the Banner -> url's and id
  const { mutateAsync: createBannerDB, isPending: isSaving } = useMutation(
    trpcHttp.banner.createBanner.mutationOptions<BannerCreatePayload>({
      onSuccess: () => {
        toast.success('Banner added successfully!');
        refetchBanners();
        setNewImageFile(null);
        setPreviewUrl(null);
        setNewWebsiteLink('');
      },
      onError: (err) => {
        toast.error(`Failed to save banner metadata: ${err.message}`);
      }
    })
  );

  // calling backend to delete a banner
  const { mutateAsync: deleteBanner } = useMutation(
    trpcHttp.banner.deleteBanner.mutationOptions({
      onSuccess: () => {
        toast.success('Banner deleted successfully!');
        refetchBanners();
      },
      onError: (err) => {
        toast.error(`Failed to delete banner metadata: ${err.message}`);
      }
    })
  );

  const handleUploadAndSave = async () => {
    if (!newImageFile) {
      toast.error('Please select an image file first.');
      return;
    }

    // Disable submission while waiting for backend response/upload
    const isProcessing = isSaving;
    if (isProcessing) return;

    try {
      // -----------------------------------------------------
      // STEP A (tRPC Query): Get the Presigned URL from the Backend
      // -----------------------------------------------------
      const presignData: BannerUploadResponse = await queryClient.fetchQuery(
        trpcHttp.banner.getBannerUploadUrl.queryOptions({
          fileName: newImageFile.name,
          fileType: newImageFile.type
        })
      );

      const { uploadUrl, fileKey, s3Url } = presignData;

      // -----------------------------------------------------
      // STEP B (Native Fetch): Direct Upload to S3 using the Presigned URL
      // -----------------------------------------------------
      console.log('Starting direct S3 upload to:', uploadUrl);
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: newImageFile,
        headers: {
          'Content-Type': newImageFile.type
        }
      });

      if (!uploadResponse.ok) {
        throw new Error(`S3 Upload failed with status: ${uploadResponse.status} - Check network.`);
      }

      console.log('S3 Upload successful. Final URL:', s3Url);

      // -----------------------------------------------------
      // STEP C (tRPC Mutation): Save the Metadata to the Database
      // -----------------------------------------------------
      await createBannerDB({
        imageUrl: s3Url,
        fileKey: fileKey,
        websiteUrl: newWebsiteLink // Send the link, even if empty string
      });
    } catch (error) {
      console.error('Full upload process failed:', error);
      toast.error(
        `Upload failed: ${error instanceof Error ? error.message : 'An unknown error occurred.'}`
      );
    }
  };

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);
  console.log(newImageFile);
  return (
    <main className="w-full space-y-5 px-3 py-5 md:space-y-8 lg:px-7">
      <Card className="w-full rounded-2xl border p-4 lg:w-[600px]">
        <CardHeader className="text-center">
          <CardTitle className="text-lg md:text-2xl">Add new banner</CardTitle>
          <CardDescription>Upload an image and link it to a website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 px-3 sm:space-y-5 sm:px-6">
          <input
            id="imageFile"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setNewImageFile(file);
              if (previewUrl) URL.revokeObjectURL(previewUrl);
              setPreviewUrl(file ? URL.createObjectURL(file) : null);
            }}
            className="border-input bg-background file:bg-accent file:text-accent-foreground w-full rounded-md border border-dashed px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-2 file:text-sm"
          />
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Selected preview"
              width={96} // 24px * 4 (h-24)
              height={96}
              className="w-full rounded-md object-cover shadow-sm"
              unoptimized // Since we're using object URL for preview
            />
          ) : null}

          <Input
            id="websiteLink"
            type="url"
            placeholder="https://some-website-url"
            value={newWebsiteLink}
            onChange={(e) => setNewWebsiteLink(e.target.value)}
            className="w-full text-sm"
          />

          <Button
            type="button"
            onClick={handleUploadAndSave}
            className="mt-2 w-full cursor-pointer px-3 py-2 text-sm"
            disabled={isSaving || !newImageFile} // Disable button if saving or if no file is selected
          >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSaving ? 'Saving Banner...' : 'Upload & Save'}
          </Button>
        </CardContent>
      </Card>{' '}
      <BannerCarousel
        banners={banners}
        isLoading={isLoadingBanners}
        onDeleteBanner={async (id: string) => {
          deleteBanner({ id });
        }}
      />
    </main>
  );
}

export default BannersPage;
