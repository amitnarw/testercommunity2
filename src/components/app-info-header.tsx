import Image from 'next/image';
import { Badge } from './ui/badge';

const AppInfoHeader = ({ logo, name, dataAiHint, category, description, status, statusConfig }: {
    logo: string, name: string, dataAiHint?: string, category: string, description: string, status: string, statusConfig: {
        badgeVariant: string;
        icon: JSX.Element;
    }
}) => {
    return (
        <header className="mb-8 mt-8">
            <div className="grid grid-cols-4 gap-8 sm:gap-4">
                <div className='flex flex-row items-start justify-start gap-5 col-span-4 sm:col-span-3'>
                    <div className='min-w-20 h-20 sm:min-w-32 sm:h-32 relative'>
                        <Image src={logo} alt={name} fill className="absolute rounded-2xl bg-background shadow-xl shadow-gray-500/10" data-ai-hint={dataAiHint} />
                    </div>
                    <div>
                        <div className="flex items-start sm:items-center flex-col sm:flex-row justify-between sm:justify-start gap-2 sm:gap-4">
                            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-b from-primary to-primary/50 bg-clip-text text-transparent leading-0">{name}</h1>
                            <Badge variant="outline" className="text-sm sm:text-lg border-none bg-gradient-to-b from-primary to-primary/50 !text-white text-normal px-5">{category}</Badge>
                        </div>

                        <div className='hidden sm:block mt-4 max-w-3xl'>
                            <p className="text-muted-foreground line-clamp-2">{description}</p>
                        </div>
                    </div>
                </div>

                <div className='block sm:hidden col-span-4 w-full'>
                    <p className="text-muted-foreground w-full !line-clamp-2">{description}</p>
                </div>

                <div className="flex flex-col items-start justify-center gap-2 col-span-4 sm:col-span-1">
                    <p className='text-black dark:text-white font-bold'>STATUS</p>
                    <p className={`flex flex-row items-center gap-4 justify-center w-full text-lg sm:text-2xl font-bold rounded-xl p-3 ${status === "In Testing" || status === "Rejected" ? "bg-gradient-to-br from-red-500/60 to-red-500/20 dark:from-red-500/30 dark:to-red-500/5" : status === "Completed" ? "bg-gradient-to-br from-green-500/60 to-green-500/20 dark:from-green-500/30 dark:to-green-500/5" : "bg-gradient-to-br from-yellow-500/60 to-yellow-500/20 dark:from-yellow-500/30 dark:to-yellow-500/5"} ${status === "In Testing" || status === "Rejected" ? "text-red-800 dark:text-red-500" : status === "Completed" ? "text-green-800 dark:text-green-500" : "text-yellow-800 dark:text-yellow-500"}`}>
                        <span>{statusConfig.icon}</span>
                        <span>{status}</span>
                    </p>
                </div>

            </div>
        </header>
    )
}

export default AppInfoHeader;