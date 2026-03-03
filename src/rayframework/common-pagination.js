export const BASE_PAGINATION = {
  current: 1,
  total: 0,
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['10', '20', '30', '40'],
  showTotal: (total) => {
    return '共' + total + '条数据';
  },
};
