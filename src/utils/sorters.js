exports.sortByFilter = (category) => {
    category = category.toLowerCase();
    
    if (category === "most upvotes") return (a, b) => {
        return b.upvotes - a.upvotes;
    }
    else if (category === "least upvotes") return (a, b) => {
        return a.upvotes - b.upvotes;
    }
    else if (category === "most comments") return (a, b) => {
        return b.comments.length - a.comments.length;
    }
    else if (category === "least comments") return (a, b) => {
        return a.comments.length - b.comments.length;
    }
}

exports.sortByDate = (a, b) => {
    return b.created_at - a.created_at;
}