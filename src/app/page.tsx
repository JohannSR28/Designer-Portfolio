import Title from "@/Component/Title/Title";
import SummaryBloc from "@/Component/SummaryBloc/SummaryBloc";
import BlocDisplayer from "@/Component/BlocDisplayer/BlocDisplayer";

function Home() {
  return (
    <main>
      <Title />
      <div style={{ height: "120px" }}></div>
      <SummaryBloc />
      <BlocDisplayer />
    </main>
  );
}

export default Home;
