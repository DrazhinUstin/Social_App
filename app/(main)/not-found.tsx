export default function NotFound() {
  return (
    <main>
      <div className='space-y-4 text-center'>
        <h1 className='text-3xl'>
          <span className='font-extrabold text-destructive'>404</span> | Page Not Found
        </h1>
        <p>The page you are looking for doesn't exist</p>
      </div>
    </main>
  );
}
