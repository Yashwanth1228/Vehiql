import React from "react";
import { getCarFilters } from "../../../../actions/car-listing";
import CarsFilters from "./_components/car-filters";
import CarListings from "./_components/car-listing";

export const metadata = {
  title: "Cars | Vehiql",
  description: "Browse and search for your dream car",
};

const CarsPage = async () => {
  const filtersData = await getCarFilters();
  return (
    <div className="conatiner mx-auto px-10 py-12">
      <h1 className="text-6xl mb-4 gradient-title">Browse Cars</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-80 shrink-0">
          {/* Filter */}
          <CarsFilters filters={filtersData.data} />
        </div>

        <div className="flex-1">
          {/* Listing */}
          <CarListings />
        </div>
      </div>
    </div>
  );
};

export default CarsPage;
