pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";
import "./Verifier.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SolnSquareVerifier is CustomERC721Token, Verifier {

    struct Solution {
        bytes32 proofHash;
        address callerAddress;
        bool isUsed;
    }

    Solution[] solutions;

    mapping(bytes32 => Solution) uniqueSolutions;

    event SolutionAdded(bytes32 proofHash, address caller);

    function verify(uint256[2] memory a, uint256[2][2] memory b, uint256[2] memory c, uint256[2] memory input) internal returns (bool) {
        return super.verifyTx(a, b, c, input);
    } 

    function addSolution(uint256[2] memory a, uint256[2][2] memory b, uint256[2] memory c, uint256[2] memory input) public{
        bytes32 proofHash = createProofHash(a, b, c, input);
        require(uniqueSolutions[proofHash].callerAddress == address(0), "Solution has already been provided");

        if (verify(a, b, c, input)) {
            Solution memory sol = Solution(proofHash, msg.sender, false);
            solutions.push(sol);
            emit SolutionAdded(proofHash, msg.sender);
        }
    }

    function mintToken(address to, uint256 tokenId) public {
        for (uint i = 0; i < solutions.length; i++) {
            if (solutions[i].callerAddress == to) {
                require(solutions[i].isUsed == false, "Solution has already been used");
                super.mint(to, tokenId);
                solutions[i].isUsed = true;
            }
        }
    }

    function createProofHash(uint256[2] memory a, uint256[2][2] memory b, uint256[2] memory c, uint256[2] memory input) internal pure returns (bytes32) {
        bytes32 keyBytes = keccak256(abi.encodePacked(a, b, c, input));
        return keyBytes;
    }

    function solutionSize() public view returns (uint256) {
        return solutions.length;
    }
}

  


























