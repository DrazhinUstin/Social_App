import { validateRequest } from '@/auth';
import { prisma } from '@/client';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError, UTApi } from 'uploadthing/server';

const f = createUploadthing();

export const ourFileRouter = {
  userAvatar: f({ image: { maxFileSize: '4MB' } })
    .middleware(async ({ req }) => {
      const { user } = await validateRequest();
      if (!user) throw new UploadThingError('Unauthorized');
      return { loggedInUser: user };
    })
    .onUploadComplete(async ({ metadata: { loggedInUser }, file }) => {
      if (loggedInUser.avatarUrl) {
        const utapi = new UTApi();
        const fileKey = loggedInUser.avatarUrl.split(`/${process.env.NEXT_PUBLIC_APP_ID}/`)[1];
        await utapi.deleteFiles(fileKey);
      }
      const avatarUrl = file.url.replace('/f/', `/a/${process.env.NEXT_PUBLIC_APP_ID}/`);
      await prisma.user.update({
        where: { id: loggedInUser.id },
        data: { avatarUrl },
      });
    }),
  postAttachment: f({
    image: { maxFileSize: '4MB', maxFileCount: 4 },
    video: { maxFileSize: '256MB', maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const { user } = await validateRequest();
      if (!user) throw new UploadThingError('Unauthorized');
      return { loggedInUser: user };
    })
    .onUploadComplete(async ({ file }) => {
      const media = await prisma.media.create({
        data: {
          url: file.url.replace('/f/', `/a/${process.env.NEXT_PUBLIC_APP_ID}/`),
          mediaType: file.type.startsWith('image') ? 'Image' : 'Video',
        },
      });
      return { id: media.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
