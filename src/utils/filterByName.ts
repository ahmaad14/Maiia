type Filterable = {
  firstName: string;
  lastName: string;
} & any;

const filterByName = (list: Filterable[], filter: string) => {
  return list.filter((item) => {
    const fullName = `${item.firstName} ${item.lastName}`.trim().toLowerCase();
    return fullName.includes(filter.toLowerCase());
  });
};

export default filterByName;
