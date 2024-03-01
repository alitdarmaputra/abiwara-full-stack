import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { Link } from "react-router-dom";

function createBin(totalPage, n) {
    var totalItem = totalPage - 2;
    // Check if no bins condition
    if (totalItem <= 0)
        return [];

    let bins = [];
    let totalBin = Math.ceil(totalItem / n);

    let lastBinValue = 1;

    for (let i = 0; i < totalBin; i++) {
        let lastIndex = bins.push(lastBinValue + n) - 1;
        lastBinValue = bins[lastIndex];
    }

    return bins;
}

function getPagePath(url, pageNum) {
    url.searchParams.set("page", `${pageNum}`);
    return url.href;
}

export default function Pagination({ stringUrl, currPage, totalPage, n = 3, className }) {
    const url = new URL(stringUrl);
    let bins = createBin(totalPage, n);

    let pages = [];
    for (const bin of bins) {
        if (currPage <= bin) {
            for (let i = bin - n + 1; i <= bin && i <= totalPage - 1; i++) {
                pages.push(
                    <Link key={i} to={getPagePath(url, i)} className={`w-[33px] h-[33px] border border-[#D0D0D0] flex items-center justify-center rounded-md ${currPage === i && "bg-[#473BF0] text-white"} dark:border-[#2D3748] dark:text-gray-200`}>
                        {i}
                    </Link>
                )
            }

            break;
        }
    }

    return (
        <div id="pagination" className={`flex gap-2 ${className}`}>
            <Link to={currPage - 1 > 0 && getPagePath(url, currPage - 1)} className={`w-[33px] h-[33px] border border-[#D0D0D0] flex items-center justify-center text-[#473BF0] rounded-md ${currPage - 1 <= 0 && "text-gray-300 pointer-events-none"} dark:border-[#2D3748] dark:text-gray-200`}>
                <AiOutlineLeft />
            </Link>
            {/* display first page */}
            {
                totalPage > 0 && (
                    <Link to={getPagePath(url, 1)} className={`w-[33px] h-[33px] border border-[#D0D0D0] flex items-center justify-center rounded-md ${currPage === 1 && "bg-[#473BF0] text-white"} dark:border-[#2D3748] dark:text-gray-200`}>
                        1
                    </Link>
                )
            }

            {/* if currPage is not in first bin */}
            {
                (bins.length > 0 && currPage > bins[0]) && (
                    <span className="dark:text-gray-400">...</span>
                )
            }


            {/* display curr bin */}
            {
                <>
                    {pages}
                </>
            }

            {/* if currPage is not in last bin */}
            {
                (bins.length > 1 && currPage < totalPage) && (
                    <span className="dark:text-gray-400">...</span>
                )
            }

            {/* display last page */}
            {
                totalPage > 1 && (
                    <Link to={getPagePath(url, totalPage)} className={`w-[33px] h-[33px] border border-[#D0D0D0] flex items-center justify-center rounded-md ${currPage === totalPage && "bg-[#473BF0] text-white"} dark:border-[#2D3748] dark:text-gray-200`}>
                        {totalPage}
                    </Link>
                )
            }

            <Link to={currPage + 1 <= totalPage && getPagePath(url, currPage + 1)} className={`w-[33px] h-[33px] border border-[#D0D0D0] flex items-center justify-center text-[#473BF0] rounded-md ${currPage + 1 > totalPage && "text-gray-300 pointer-events-none"} dark:border-[#2D3748] dark:text-gray-200`}>
                <AiOutlineRight />
            </Link>
        </div>
    )
}
