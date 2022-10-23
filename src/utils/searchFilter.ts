const searchFilter = (value: string, filter: string) => {
  return value.trim().toLowerCase().includes(filter.trim().toLowerCase());
};

export default searchFilter;
