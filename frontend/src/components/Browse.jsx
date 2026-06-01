import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { setSearchedQuery } from "@/redux/jobSlice";
import Footer from "./shared/Footer";
import PageHero from "./shared/PageHero";
import FilterCard from "./FilterCard";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Browse = () => {
  const [activeFilters, setActiveFilters] = useState({});
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  useGetAllJobs(activeFilters);

  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const hasActiveFilters = Object.values(activeFilters).some((values) => values?.length > 0);

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, [dispatch]);

  const clearAllFilters = () => {
    setActiveFilters({});
  };

  return (
    <div>
      <Navbar />

      {/* PageHero with padding */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 max-w-6xl mx-auto">
        <PageHero
          image="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400"
          title="Explore Opportunities"
          subtitle="Filter by role, salary, location and work mode. Your next career move is here."
          btnText="Start browsing"
          btnLink="/browse"
          align="left"
        />
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 my-6 sm:my-10">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="font-bold text-lg sm:text-xl text-gray-900">
              Search Results
              <span className="ml-2 text-sm sm:text-base font-medium text-[#6a38c2]">
                ({allJobs.length})
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
              {allJobs.length > 0
                ? `Showing ${allJobs.length} open position${allJobs.length > 1 ? "s" : ""}`
                : "No results found"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-xl border border-red-100 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors"
              >
                Clear filters
              </button>
            )}
            <button
              onClick={() => setShowMobileFilter(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e0d4fd] bg-white text-[#6a38c2] text-sm font-semibold hover:bg-[#f3eeff] transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6">
          <div className="hidden lg:block sticky top-24 self-start">
            <FilterCard activeFilters={activeFilters} setActiveFilters={setActiveFilters} />
          </div>

          <div className="space-y-6">
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
                <span className="font-medium">Active filters:</span>
                {Object.entries(activeFilters).flatMap(([category, values]) =>
                  values.map((value) => (
                    <span
                      key={`${category}-${value}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-50 text-[#6a38c2] border border-purple-100"
                    >
                      {category}: {value}
                      <button
                        onClick={() => {
                          setActiveFilters((prev) => {
                            const next = { ...prev };
                            next[category] = next[category].filter((item) => item !== value);
                            if (next[category].length === 0) delete next[category];
                            return next;
                          });
                        }}
                        className="hover:text-red-500"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            )}

            {allJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
                <div className="h-14 w-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-[#6a38c2]" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
                  No jobs found
                </h2>
                <p className="text-sm text-gray-400 max-w-xs">
                  Try adjusting your search or browse all available listings.
                </p>
                <button
                  onClick={() => {
                    dispatch(setSearchedQuery(""));
                    clearAllFilters();
                    navigate("/browse");
                  }}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-[#6a38c2] text-white text-sm font-semibold hover:bg-[#5b2db0] transition-colors"
                >
                  Reset search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {allJobs.map((job) => (
                  <Job key={job._id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {showMobileFilter && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/30" onClick={() => setShowMobileFilter(false)} />
          <div className="relative w-[320px] max-w-[90vw] bg-white shadow-2xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Filters</h2>
              <button onClick={() => setShowMobileFilter(false)} className="text-gray-500 hover:text-gray-900">
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterCard activeFilters={activeFilters} setActiveFilters={setActiveFilters} />
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  clearAllFilters();
                  setShowMobileFilter(false);
                }}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Clear all
              </button>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="flex-1 py-2 rounded-xl bg-[#6a38c2] text-white text-sm font-semibold hover:bg-[#5b2db0]"
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Browse;