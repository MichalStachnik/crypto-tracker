import { useState, useRef, useContext } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Box, Button, CircularProgress } from '@mui/material';
import { BlockContext } from '../contexts/BlockContext';

function Block(props: ThreeElements['mesh']) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  useFrame((state, delta) => (meshRef.current.rotation.y += delta));
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'darkgreen' : 'orange'} />
    </mesh>
  );
}

const Explorer = () => {
  const { blocks, getBlockByHash, isLoading } = useContext(BlockContext);
  return (
    <Box>
      {isLoading && <CircularProgress />}
      <Button
        onClick={() => getBlockByHash(blocks[0].prev_block)}
        variant="outlined"
        disabled={isLoading}
      >
        Fetch previous block
      </Button>
      <Box width="100vw" height="100vh">
        <Canvas>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          {blocks.map((block, index) => {
            const position = new THREE.Vector3(index + 0.1, -0.7, 0);
            return (
              <group position={position} key={block.hash}>
                <Text
                  scale={[0.2, 0.2, 0.2]}
                  color="orange"
                  anchorX="center"
                  anchorY="top-baseline"
                >
                  {block.height}
                </Text>
                <Block position={position} />
              </group>
            );
          })}
          <OrbitControls />
        </Canvas>
      </Box>
    </Box>
  );
};

export default Explorer;
