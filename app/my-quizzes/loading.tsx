import { Skeleton } from "@/components/ui/skeleton"

function Loading() {
    return (
        <div className="container py-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <Skeleton className="h-9 w-32 rounded-md" />
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <Skeleton className="h-9 w-full sm:w-96" />
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-9" />
                        <Skeleton className="h-9 w-24" />
                    </div>
                </div>

                <Skeleton className="h-10 w-96 rounded-md" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-48 rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Loading;
