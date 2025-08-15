import Image from 'next/image';

import Logo from '../../../../../public/Assets/Logo.png';

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center lg:flex-row lg:justify-items-normal">
      <div className="admin-welcom-con flex w-full flex-col items-center justify-center lg:h-screen lg:w-[60%]">
        <div className="flex max-w-4xl flex-col items-center justify-center gap-5 p-3 md:p-5 lg:items-start lg:gap-10 lg:p-10">
          <Image src={Logo} alt="logo" className="w-23 md:w-28 lg:w-35" />
          <div className="flex flex-col items-center justify-center gap-0 text-center md:text-left lg:items-start lg:gap-4">
            <h1 className="text-1xl font-extrabold tracking-tight text-[#442816] md:text-2xl lg:text-5xl">
              Welcome!
            </h1>
            <span className="md:text-1xl text-sm font-semibold text-[#442816] lg:text-3xl">
              Let’s set up your store.
            </span>
            <p className="hidden text-lg leading-relaxed text-[#442816] md:text-xl lg:block">
              <strong className="text-[#6B0F1A]">Hey Partner,</strong> you&apos;re in charge! Add
              products, track stock, monitor performance in real-time, and keep your customers
              coming back. Your store, your rules —{' '}
              <em className="font-medium text-[#6B0F1A]">let’s make business thrive!</em>
            </p>
          </div>
          <span className="hidden text-base font-medium text-[#442816] italic lg:block">
            Keep the shelves full and customers happy!
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}
