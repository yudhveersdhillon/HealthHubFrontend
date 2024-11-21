import { Button, Flex, Text, Box,Select } from "@chakra-ui/react";

const Pagination = ({total,page,limit,setPage,setLimit}) => {

    return <Box>
   <Flex justify="between" mt={4}>
        <Text>{total} Record(s) found</Text>
        {total>limit && <Flex justify="end" mt={4}>
            <Select
                value={limit}
                onChange={(e) =>{
                    setLimit(parseInt(e.target.value, 10));
                    setPage(1);
                }}
                width="100px"
            >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
            </Select>
            <Button
                isDisabled={page === 1}
                onClick={() => setPage(page - 1)}
                mr={2}
            >
                Previous
            </Button>
            <Text>
                Page {page} of {(total/limit).toFixed(0)}
            </Text>
            <Button
                isDisabled={page === (total/limit).toFixed(0)}
                onClick={() => setPage(page + 1)}
                ml={2}
            >
                Next
            </Button>
        </Flex>}
    </Flex>
  </Box >
}
export default Pagination;