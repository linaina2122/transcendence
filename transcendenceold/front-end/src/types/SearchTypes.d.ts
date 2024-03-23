interface User {
    id: string;
    images: string[];
    name: string;
}

interface Groupe {
    image: string;
    name: string;
}

export interface SearchType {
    users: User[];
    groups: Group[];
}

export interface SearchTypeComp {
    results: SearchType | any;
    searchOpen: boolean;
    searchJustOpened: boolean;
    setSearchJustOpened: (open: boolean) => void;
    setSearchOpen: (open: boolean) => void;
    loading: boolean;
    setSearch: (search: string) => void;
}
