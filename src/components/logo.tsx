import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-headline text-lg font-bold tracking-tight">
      <Image 
        src="https://firebasestorage.googleapis.com/v0/b/studio-1401027088-c36bc.firebasestorage.app/o/FORVIA_Symbol_F_RVB.png?alt=media&token=f1b954a9-d78b-4b6f-b5cc-24ed9078ce24" 
        alt="Logo FES" 
        width={28} 
        height={28}
        className="h-7 w-7"
      />
      <span className="text-foreground">Passaporte FES</span>
    </div>
  );
}
