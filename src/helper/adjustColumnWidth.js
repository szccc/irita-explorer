export default function(el) {
  let widthList = [];

  el.querySelectorAll(".el-table__body tr").forEach(tr => {
    tr.querySelectorAll("td .cell").forEach((td, i) => {
      if (!widthList[i]) {
        widthList[i] = [73];
      }
        widthList[i].push(td.scrollWidth);
    });
  });
  console.log(widthList);
  console.log(widthList.map(width => Math.max(...width)))
  return widthList.map(width => Math.max(...width));
}
