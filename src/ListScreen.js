import React, { useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import swal from "sweetalert";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  Stack,
  Container,
  Divider,
  TextField,
  Button,
  TablePagination,
  Pagination,
  AppBar,
  Toolbar,
  Grid
} from "@mui/material";
import "./app.css";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CustomAppbar from "./CustomAppBar";

function ListScreen() {
  const [data, setData] = useState();
  let [searchParams, setSearchParams] = useSearchParams();
  const [searchContents, setSearchContents] = useState(
    searchParams.get("content")
  );
  const [searchName, setSearchName] = useState(searchParams.get("name"));
  const [date1, setDate1] = useState(searchParams.get("from") && dayjs(searchParams.get("from")));
  const [date2, setDate2] = useState(searchParams.get("from") && dayjs(searchParams.get("to")));

  const navigate = useNavigate();

  const [pageSize, setPageSize] = useState(1);

  const firstIndex = 0;
  const lastIndex = 25;

  const [currentPage, setCurrentPage] = useState(1);

  const navigateData = (currentSelectedPage) => {
    console.log(date1);
    navigate({
      pathname: "",
      search: createSearchParams({
        ...(currentPage && {
          pageNo:
            currentSelectedPage === 0 || currentSelectedPage
              ? currentSelectedPage - 1
              : currentPage - 1,
        }),
        ...(searchContents && { content: searchContents }),
        ...(date1 && { from: new Date(date1).toISOString() }),
        ...(date2 && { to: new Date(date2).toISOString() }),
        ...(searchName && { name: searchName }),
        ...(pageSize && { pageSize: pageSize }),
      }).toString(),
    });
  };

  /*
  useEffect(()=>{
    navigateData()
  },[currentPage])
  */

  const [firstOpenLock, setFirstOpenLock] = useState(false)
  useEffect(() => {
    console.log("content", searchParams.get("content"));
    if (
      searchParams.get("content") ||
      searchParams.get("from") ||
      searchParams.get("to") ||
      searchParams.get("name")
    ) {
      getData();
    } else {
      firstOpenLock && swal("Uyarı", "Arama için formda en az 1 alanı doldurunuz", "warning");
    }
    setFirstOpenLock(true)
  }, [searchParams]);

  const getData = async () => {
    console.log("HERE2");
    const url = `http://localhost:3000/pdf-news-doc/?${searchParams}`;
    try {
      const response = await axios.get(url);
      setData(response.data);
      console.log(response.data);
      if (response.status === 200) {
        console.log(response.data);
      } else {
        console.log("hata var");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const numbers = [...Array(25 + 1).keys()].slice(1);
  console.log(currentPage);

  return (
    <div>
      <CustomAppbar/>
      <Container>
        <form
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              navigateData();
            }
          }}
        >
          <Grid container spacing={2} marginTop={1}>
            <Grid item lg={3} sm={6} xs={12}>
              <TextField
                fullWidth
                onChange={(e) => setSearchContents(e.target.value)}
                value={searchContents}
                variant="filled"
                label="İçerik"
              />
            </Grid>

            <Grid item lg={3} sm={6} xs={12}>
              <TextField
                fullWidth
                onChange={(e) => setSearchName(e.target.value)}
                value={searchName}
                variant="filled"
                label="Gazete İsmi"
              />
            </Grid>
            <Grid item lg={2} sm={5}  xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs} locale={"tr"}>
                <DatePicker
                  
                  label="En Eski"
                  variant="filled"
                  value={date1}
                  onChange={(val) => setDate1(val)}
                  slotProps={{ textField: { variant: "filled", fullWidth:true } }}
                ></DatePicker>
              </LocalizationProvider>
            </Grid>
            <Grid item lg={2} sm={5} xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs} locale={"tr"}>
                <DatePicker
                
                  label="En Yeni"
                  variant="filled"
                  value={date2}
                  onChange={(val) => setDate2(val)}
                  slotProps={{ textField: { variant: "filled",fullWidth:true } }}
                ></DatePicker>
              </LocalizationProvider>
            </Grid>
            <Grid item lg={2} sm={2} xs={12}>
              <Button
                fullWidth
                sx={{minHeight:"100%"}}
                onClick={() => navigateData()}
                variant="contained"
                size="large"
              >
                Ara
              </Button>
            </Grid>
          </Grid>
        </form>

        {data?.matches?.map((d, i) => (
          <Card
            key={i}
            sx={{
              display: "flex",
              marginY: 2,
              minHeight: 200,
              padding: 2,
              borderRadius: 3,
            }}
          >
            <CardMedia
              component="img"
              sx={{ width: 200 }}
              image={d?.result?.fileURL + "-thumbnail.jpg"}
              alt="Resime erişilirken hata oluştu"
            />
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
              <CardContent sx={{ flex: "1 0 auto", paddingX: 4 }}>
                <Stack
                  direction="row"
                  justifyContent={"space-between"}
                  spacing={2}
                >
                  <Typography component="div" variant="h5" color={"primary"}>
                    {d.result.name}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    component="div"
                  >
                    {d.result?.date?.toString().split("T")[0]}
                  </Typography>
                </Stack>

                {d?.highlights?.content?.map((c) => (
                  <>
                    <Divider />
                    <Typography textAlign="left" variant="body1" marginTop={1}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: c,
                        }}
                      ></div>
                    </Typography>
                  </>
                ))}
              </CardContent>
            </Box>
          </Card>
        ))}

        {console.log(currentPage)}
        {/*<TablePagination
          component="div"
          count={data?.total?.value||0}
          page={currentPage}
          onPageChange={changeCPage}
          rowsPerPage={pageSize}
          onRowsPerPageChange={setPageSize}
        />*/}
        <Box display="flex" justifyContent="center">
          <Pagination
            count={data?.total?.value > 0 ? data?.total?.value / pageSize : 0}
            page={currentPage}
            onChange={changeCPage}
          />
        </Box>
      </Container>
    </div>
  );

  function prePage() {
    if (currentPage !== firstIndex) {
      setCurrentPage(currentPage - 1);
      navigateData(currentPage - 1);
    }
  }
  function changeCPage(event, value) {
    setCurrentPage(value);
    navigateData(value);
  }
  function nextPage() {
    if (currentPage !== lastIndex) {
      setCurrentPage(currentPage + 1);
      navigateData(currentPage + 1);
    }
  }
}

export default ListScreen;
