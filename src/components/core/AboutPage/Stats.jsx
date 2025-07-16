const stats = [
  {
    count: "5K",
    lable: "Active Students",
  },
  {
    count: "10+",
    lable: "Mentors",
  },
  {
    count: "200+",
    lable: "courses",
  },{
    count: "50+",
    lable: "Awards",
  },
];
const Stats = () => {
  return (<section className="bg-richblack-700">
    <div className="flex flex-col gap-10 justify-between w-11/12 max-w-maxContent text-white mx-auto ">
        <div className="grid grid-cols-2 md:grid-cols-4 text-center ">
            {
                stats.map((data,index)=>(
                    <div key={index} className="flex flex-col py-10">
                        <h3 className="text-[30px] font-bold text-richblack-5">{data.count}</h3>
                        <h4>{data.lable}</h4>
                    </div>
                ))
            }
        </div>
    </div>
  </section>)
};

export default Stats;
