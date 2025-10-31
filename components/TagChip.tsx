
import React from 'react';

interface TagChipProps {
    text: string;
}

const TagChip: React.FC<TagChipProps> = ({ text }) => {
    return (
        <span className="inline-block bg-accent/20 text-accent text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {text}
        </span>
    );
};

export default TagChip;
