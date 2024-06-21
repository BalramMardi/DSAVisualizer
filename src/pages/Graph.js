import React from "react";
import Layout from "../Layout/Layout";
import PathfindingVisualizer from "../PathfindingVisualizer/PathfindingVisualizer";

const Graph = () => {
  return (
    <Layout title={GraphSeo.title} description={GraphSeo.description}>
      <PathfindingVisualizer />
    </Layout>
  );
};

export default Graph;

const GraphSeo = {
  title: "Path Finding Visualizer",
  description: "It finds the path from start to end",
};
