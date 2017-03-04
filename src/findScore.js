export default function(tBody, awa, beer) {
  let datas = Array.from(tBody.rows).map(r => r.innerHTML.match(/\d+/g));
  let index = datas.findIndex(r => r && Number(r[0]) === beer && Number(r[1]) === awa );
  tBody.rows[index].style.backgroundColor = "#fb8c8c";
}
