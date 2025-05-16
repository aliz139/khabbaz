export default function CategoryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center whitespace-nowrap justify-center text-xl font-bold gap-2 border rounded py-7 px-8 bg-gray-100 cursor-pointer active:bg-gray-300 active:border-gray-400  focus:bg-gray-300 focus:border-gray-400 transition-colors"
    >
      {children}
    </button>
  );
}
