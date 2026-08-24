import type { SVGAttributes } from 'react';

export default function ArkaLogo(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg">
            <path d="M110 8L150 70H70L110 8Z" fill="#c9962c" />
            <path d="M110 8L70 70H110V8Z" fill="#0b1b3a" />
            <path
                d="M40 108C60 88 90 96 110 108C130 120 160 128 180 108C170 128 145 142 110 138C75 142 50 128 40 108Z"
                fill="#1c9b8e"
            />
            <path
                d="M110 138C75 142 50 128 40 108C55 118 75 122 90 118L110 138Z"
                fill="#156f66"
            />
            <text
                x="110"
                y="150"
                textAnchor="middle"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontWeight="700"
                fontSize="26"
                letterSpacing="2"
                fill="currentColor"
            >
                ARKA
            </text>
        </svg>
    );
}
