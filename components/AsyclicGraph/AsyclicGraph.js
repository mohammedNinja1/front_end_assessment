import {
  ExpandLess,
  ExpandMore,
  GitHub,
  GiteOutlined,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import Tree from 'react-d3-tree';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';

const renderForeignObjectNode = ({
  nodeDatum,
  toggleNode,
  foreignObjectProps,
  theme,
}) => (
  <g style={{ background: 'red' }}>
    <circle r={5}></circle>
    {/* `foreignObject` requires width & height to be explicitly set. */}
    <foreignObject {...foreignObjectProps} x={-100} y={5}>
      <div
        onClick={Boolean(nodeDatum.children?.length) ? toggleNode : () => {}}
        style={{
          borderRadius: 10,
          backgroundColor: '#384E94',
          margin: 10,
          left: -10,
        }}
      >
        <Box display={'flex'}>
          <Box
            sx={{
              width: 70,
              minHeight: 60,
              height: '100%',
              borderRadius: '10px 0px 0px 10px',
              background: nodeDatum.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img alt={'icon'} src={'/checked.png'} width={30} />
          </Box>
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            width={'100%'}
            alignItems={'center'}
            px={1}
            pr={2}
          >
            <Box>
              <Typography
                sx={{ mt: 1, fontSize: 15, color: alpha('#fff', 0.5) }}
                variant='h3'
              >
                {nodeDatum.name}
              </Typography>
              <Typography style={{ margin: 0, color: alpha('#fff', 0.2) }}>
                {nodeDatum.attributes?.department}
              </Typography>
            </Box>
            {Boolean(nodeDatum.children?.length) &&
              (nodeDatum.__rd3t.collapsed ? (
                <ExpandMore sx={{ width: 20 }} />
              ) : (
                <ExpandLess sx={{ width: 20 }} />
              ))}
          </Box>
        </Box>
      </div>
    </foreignObject>
  </g>
);

// This is a simplified example of an org chart with a depth of 2.
// Note how deeper levels are defined recursively via the `children` property.
const orgChart = {
  name: 'CEO',
  color: '#F1917B',
  children: [
    {
      name: 'Manager',
      color: '#5E92FF',
      attributes: {
        department: 'Production',
      },
      children: [
        {
          name: 'Foreman',
          color: '#C2186B',
          attributes: {
            department: 'Fabrication',
          },
          children: [
            {
              name: 'Worker',
              color: '#FFB771',
            },
          ],
        },
        {
          name: 'Foreman',
          color: '#5E92FF',
          attributes: {
            department: 'Assembly',
          },
          children: [
            {
              name: 'Worker',
              color: '#9DB673',
            },
          ],
        },
      ],
    },
  ],
};
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // only execute all the code below in client side
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

export default function AsyclicGraph() {
  const nodeSize = { x: 300, y: 200 };
  const size = useWindowSize();

  const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: 20 };
  const theme = useTheme();
  return (
    // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
    <div
      id='treeWrapper'
      style={{ width: '100vw', height: '100vh', background: '#23377E' }}
    >
      <Tree
        translate={{
          x: size.width / 2,
          y: size.height / 4,
        }}
        enableLegacyTransitions
        dimensions={{ width: 1300, height: 500 }}
        orientation='vertical'
        pathFunc='elbow'
        separation={{ siblings: 2.5, nonSiblings: 2 }}
        data={orgChart}
        renderCustomNodeElement={(props) =>
          renderForeignObjectNode({ ...props, foreignObjectProps, theme })
        }
      />
    </div>
  );
}
