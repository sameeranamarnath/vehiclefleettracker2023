import { Vendor, Vendors } from "@/api/types";
import { Dispatch, SetStateAction } from "react";
import styled from 'styled-components';
import InfiniteScroll from "react-infinite-scroll-component";
import { getVendors } from "@/api/vendors";
import { vendorsSort } from "@/common/utils";
import { Box, CircularProgress } from "@mui/material";

import { Geo } from "@/api/types";
import { Avatar, List, ListItemAvatar, ListItemButton, Typography } from "@mui/material";


//Since we are not using the child components elsewhere, adding them to the same class
//this will change once the complexity increases and we wanna write tests
interface TileProps {
    imgUrl: string,
    name: string,
    geo?: Geo,
}

const ListStyled = styled(List)`
    width: 100%;
    padding-top: 0px;
    padding-bottom: 0px;
`;

const ImageStyled = styled.img`
    width: 40px;
`;

const TextContainer = styled.div`
    padding: 10px 0;
    display: flex;
    flex-direction: column;
`;

const AddressDisplay = styled.div`
    display: flex;
    flex-direction: column;
`;

 function LocationDisplay ({geo}: {geo?: Geo}) {
    if (geo) {
        return (
            <AddressDisplay>
                <Typography component="span">{geo.full_name}</Typography>
                <Typography component="span">{geo.coordinates.lat.toFixed(4)} | {geo.coordinates.long.toFixed(4)}</Typography>
            </AddressDisplay>
        )
    }

    return <Typography component="span">-</Typography>
}

 function Tile({imgUrl, name, geo}: TileProps) {
    return (
        <>
            <ListStyled>
                <ListItemButton>
                    <ListItemAvatar>
                        <Avatar sx={{ width: 40, height: 40 }}>
                            <ImageStyled src={imgUrl} />
                        </Avatar>
                    </ListItemAvatar>

                    <TextContainer>
                        <Typography component="span">{name}</Typography>
                        <LocationDisplay geo={geo} />
                    </TextContainer>
                </ListItemButton>
            </ListStyled>
        </>
    )
}

 function Loader() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', margin: '20px'}}>
            <CircularProgress />
        </Box>
    )
}
interface DashboardProps {
    vendors: Vendors;
    setVendors: Dispatch<SetStateAction<Vendors>>;
}

const DashboardStyledDiv = styled.div`
    width: 400px;
    overflow: auto;
`;

export default function Sidebar({vendors, setVendors}: DashboardProps) {
    const next = async () => {
        try {
            const updatedVendors: Vendors = {
                Items: [...vendors.Items],
                count: 0,
                lastEvaluatedKey: null
            }

            const res = await getVendors<Vendors | Error>(1, vendors.lastEvaluatedKey ?? undefined) as Vendors;

            res.Items.forEach((newVendor: Vendor) => {
                updatedVendors.Items.push(newVendor)
            })

            updatedVendors.Items = vendorsSort(updatedVendors.Items)
            updatedVendors.count = vendors.count + res.count;
            updatedVendors.lastEvaluatedKey = res.lastEvaluatedKey;
            setVendors(updatedVendors);
        } catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
            } else {
                throw new Error('getVendors unexpected error');
            }
        }
    }

    return (
        <DashboardStyledDiv id="scrollableDiv">
            <InfiniteScroll
                dataLength={vendors.Items.length}
                next={next}
                hasMore={!!vendors.lastEvaluatedKey}
                scrollableTarget="scrollableDiv"
                loader={<Loader />}
            >
                {
                    vendors.Items.map(
                        vendor => (
                            <Tile key={vendor.twitterId} imgUrl={vendor.image} name={vendor.name} geo={vendor.tweets[vendor.tweets.length - 1]?.geo}/>
                        )
                    )
                }
            </InfiniteScroll>
        </DashboardStyledDiv>
    )
}