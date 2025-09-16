const DeveloperInstructions = ({ title, instruction, mt }: { title?: string, instruction: string, mt?: number }) => {
    return (
        <section className={`${mt ? "mt-"+mt : "mt-16"}`}>
            <h2 className="mb-4 flex flex-row items-center justify-between gap-2 sm:justify-start">
                <span className="text-2xl font-bold whitespace-nowrap">{title ? title : "Developer's Instructions"}</span>
                <span className="bg-gradient-to-b from-primary to-primary/50 text-white font-bold rounded-lg px-4 py-0.5 text-xl hidden sm:inline">Important</span>
            </h2>
            <div className="prose prose-base dark:prose-invert leading-relaxed text-white dark:text-black bg-[#121212] dark:bg-white p-3 sm:p-6 rounded-lg border-primary border-l-4 shadow-xl shadow-gray-300 dark:shadow-gray-700 text-sm sm:text-base">
                <span className="bg-gradient-to-b from-primary to-primary/50 text-white font-bold rounded-md px-4 py-0.5 text-lg inline sm:hidden">Important</span>
                <p className='mt-2 sm:mt-0'>{instruction}</p>
            </div>
        </section>
    )
}

export default DeveloperInstructions;