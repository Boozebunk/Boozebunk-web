'use client';

import * as React from 'react';
import Image from 'next/image';

import { Upload } from 'lucide-react';
import { toast } from 'sonner';

import { AspectRatio } from '~/shared/shadcn/aspect-ratio';
import { Button } from '~/shared/shadcn/button';
import { Card, CardContent } from '~/shared/shadcn/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '~/shared/shadcn/dialog';
import { Input } from '~/shared/shadcn/input';
import { Label } from '~/shared/shadcn/label';

type DialogBoxProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function AddPromotionsBanner({ open, onOpenChange }: DialogBoxProps) {
  const [banner, setBanner] = React.useState<string | null>(null);
  const [link, setLink] = React.useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBanner(url);
    }
  };

  const handleSave = () => {
    if (!banner || !link) {
      toast.error('Please upload a banner and add a link.');
      return;
    }

    toast.success('Your banner has been uploaded successfully.');

    // reset
    setBanner(null);
    setLink('');

    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-fit !max-w-[90%]">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold sm:text-xl">
            Add New Promotions Banner
          </DialogTitle>
          <DialogDescription className="text-center text-xs sm:text-sm">
            Upload an image and set a redirect link
          </DialogDescription>
        </DialogHeader>

        <Card className="w-[80vw] border-none p-0 shadow-none lg:w-[700px]">
          <CardContent className="space-y-5 p-0">
            {/* Upload Area */}
            <div className="relative">
              {!banner ? (
                <label className="bg-muted/20 hover:bg-muted/30 flex h-52 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 transition">
                  <Upload className="text-muted-foreground mb-2 h-6 w-6" />
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      Click or drag to upload banner
                    </span>
                    <span className="text-muted-foreground text-center text-xs sm:text-sm">
                      Ensure image size: 1500 × 600 px for best experience.
                    </span>
                  </div>

                  <Input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={handleFile}
                  />
                </label>
              ) : (
                <div className="relative">
                  <AspectRatio ratio={16 / 6}>
                    <Image
                      src={banner}
                      alt="Banner preview"
                      fill
                      className="rounded-xl object-fill"
                    />
                  </AspectRatio>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-background/70 absolute top-3 right-3 backdrop-blur-sm"
                    onClick={() => setBanner(null)}>
                    Replace
                  </Button>
                </div>
              )}
            </div>

            {/* Link Input */}
            <div className="space-y-2">
              <Label htmlFor="link">Redirect URL</Label>
              <Input
                className="sm:text-md text-sm"
                id="link"
                placeholder="https://example.com"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>

            {/* Save Buttons */}
            <div className="flex justify-end gap-2 pt-3">
              <Button
                variant="outline"
                onClick={() => {
                  setBanner(null);
                  setLink('');
                }}>
                Clear
              </Button>
              <Button onClick={handleSave}>Save Banner</Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
