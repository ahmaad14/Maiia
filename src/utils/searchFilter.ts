const searchFilter = (value: string, filter: string) => {
  return value.trim().toLowerCase().includes(filter.toLowerCase());
};

export default searchFilter;
