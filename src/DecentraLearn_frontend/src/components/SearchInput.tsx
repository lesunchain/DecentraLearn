import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";

function SearchInput() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search/${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form className="relative w-full flex-1 max-w-[300px]" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Search courses..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-full bg-primary/10 px-4 py-2 pl-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </form>
    );
}

export default SearchInput;
