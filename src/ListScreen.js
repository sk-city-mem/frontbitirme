import React, { useEffect, useState } from "react";

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
  Pagination,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import "./app.css";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CustomAppbar from "./CustomAppBar";
import { useAuthContext } from "./AuthProvider";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

function ListScreen() {
  const [data, setData] = useState();
  const context = useAuthContext();
  let [searchParams, setSearchParams] = useSearchParams();
  const [searchContents, setSearchContents] = useState(
    searchParams.get("content")
  );
  const [searchName, setSearchName] = useState(searchParams.get("name"));
  const [date1, setDate1] = useState(
    searchParams.get("from") && dayjs(searchParams.get("from"))
  );
  const [date2, setDate2] = useState(
    searchParams.get("to") && dayjs(searchParams.get("to"))
  );

  const getAdvencedFields = () => {
    return searchParams
      .getAll("must[]")
      ?.map((val) => {
        return { type: "must", value:val };
      })
      .concat(
        searchParams.getAll("should[]")?.map((val) => {
          return { type: "should", value:val  };
        })
      )
      .concat(
        searchParams.getAll("mustNot[]")?.map((val) => {
          return { type: "mustNot", value:val };
        })
      );
  };
  const [advencedQueryFields, setAdvencedQueryFields] = useState(
    getAdvencedFields() || []
  );

  const [fuzzy, setFuzzy] = useState(searchParams.get("fuzzy"));

  const addFields = () => {
    let object = {
      type: "must",
      value: "",
    };

    setAdvencedQueryFields([...advencedQueryFields, object]);
  };

  const handleAdvencedFieldChange = (event, index) => {
    console.log(event.target.value);
    let data = [...advencedQueryFields];
    data[index][event.target.name] = event.target.value;
    setAdvencedQueryFields(data);
  };

  const removeFields = (index) => {
    let data = [...advencedQueryFields];
    data.splice(index, 1);
    setAdvencedQueryFields(data);
  };

  const navigate = useNavigate();

  const [pageSize, setPageSize] = useState(10);

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
        ...(fuzzy && { fuzzy: fuzzy }),
        ...(advencedQueryFields && groupByKey(advencedQueryFields, "type")),
      }).toString(),
    });
  };

  const groupByKey = (list, key) => {
    let formatted = {};
    list.forEach((element) => {
      if (formatted.hasOwnProperty(element[key] + "[]")) {
        formatted[element[key] + "[]"].push(element.value);
      } else {
        formatted = { ...formatted, [element[key] + "[]"]: [element.value] };
      }
    });
    return formatted;
  };

  /*
  useEffect(()=>{
    navigateData()
  },[currentPage])
  */

  const [firstOpenLock, setFirstOpenLock] = useState(false);
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
      firstOpenLock &&
        swal("Uyarı", "Arama için formda en az 1 alanı doldurunuz", "warning");
    }
    setFirstOpenLock(true);
  }, [searchParams]);

  const getData = async () => {
    console.log("HERE2");
    const url = `http://localhost:3000/pdf-news-doc/?${searchParams}`;
    try {
      const response = await axios.get(url, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: 0,
        },
      });
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

  const deleteById = async (id) => {
    console.log(id);
    try {
      const res = await axios.delete(
        "http://localhost:3000/pdf-news-doc-orm/" + id,
        {
          headers: {
            Authorization: `Bearer ${context.token}`,
          },
        }
      );
      setDeleteDialogOpen({
        open: false,
        agreeFunc: () => {},
      });
      toast.success("Gazete Silme Başarılı !");
      getData();
    } catch (err) {
      setDeleteDialogOpen({
        open: false,
        agreeFunc: () => {},
      });
      context.updateToken();
    }
  };

  const [updateDialogOpen, setUpdateDialogOpen] = React.useState({
    open: false,
    formData: { id: "", date: "", name: "" },
  });

  const handleClickUpdate = (id, body) => {
    setUpdateDialogOpen({
      open: true,
      formData: { id: id, ...body },
    });
  };

  const handleCloseUpdate = () => {
    setUpdateDialogOpen({
      open: false,
      formData: { id: "", date: "", name: "" },
    });
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState({
    open: false,
    agreeFunc: () => {},
  });

  const handleClickDelete = (id) => {
    setDeleteDialogOpen({
      open: true,
      agreeFunc: () => deleteById(id),
    });
  };

  const handleClose = () => {
    setDeleteDialogOpen({ open: false, agreeFunc: () => {} });
  };
  return (
    <div>
      <CustomAppbar />
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
            <Grid item lg={2} sm={4} xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs} locale={"en"}>
                <DatePicker
                  inputFormat="DD/MM/YYYY"
                  label="En Eski"
                  variant="filled"
                  value={date1}
                  onChange={(val) => setDate1(val)}
                  slotProps={{
                    textField: { variant: "filled", fullWidth: true },
                  }}
                ></DatePicker>
              </LocalizationProvider>
            </Grid>
            <Grid item lg={2} sm={4} xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs} locale={"en"}>
                <DatePicker
                  inputFormat="DD/MM/YYYY"
                  label="En Yeni"
                  variant="filled"
                  value={date2}
                  onChange={(val) => setDate2(val)}
                  slotProps={{
                    textField: { variant: "filled", fullWidth: true },
                  }}
                ></DatePicker>
              </LocalizationProvider>
            </Grid>
            <Grid item lg={1.2} sm={2.2} xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fuzzy}
                    onChange={(event) => setFuzzy(event.target.checked)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label={
                  <Typography variant="body2">Yakın Sonuçları Getir</Typography>
                }
              />
            </Grid>
            <Grid item lg={0.8} sm={1.8} xs={6}>
              <Button
                fullWidth
                sx={{ minHeight: "100%" }}
                onClick={() => navigateData()}
                variant="contained"
                size="large"
              >
                Ara
              </Button>
            </Grid>

            {advencedQueryFields.length > 0 ? (
              <>
                {advencedQueryFields.map((form, index) => {
                  return (
                    <Grid item container lg={4} sm={6} xs={12} key={index}>
                      <Grid item xs={4}>
                        <FormControl variant="filled" fullWidth>
                          <InputLabel id="demo-simple-select-filled-label">
                            Operatör
                          </InputLabel>
                          <Select
                            name="type"
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            onChange={(event) =>
                              handleAdvencedFieldChange(event, index)
                            }
                            value={form.type}
                          >
                            <MenuItem value={"must"}>AND</MenuItem>
                            <MenuItem value={"should"}>OR</MenuItem>
                            <MenuItem value={"mustNot"}>NOT</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={7}>
                        <TextField
                          fullWidth
                          name="value"
                          label="Değer"
                          onChange={(event) =>
                            handleAdvencedFieldChange(event, index)
                          }
                          value={form.value}
                          variant="filled"
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <Button
                          color="error"
                          onClick={() => removeFields(index)}
                          sx={{ padding: 1, minWidth: 24, height: "100%" }}
                        >
                          <RemoveCircleOutlineIcon />
                        </Button>
                      </Grid>
                    </Grid>
                  );
                })}
                <Grid item xs={1}>
                  <Button onClick={() => addFields()} sx={{ height: "100%" }}>
                    <AddCircleOutlineIcon />
                  </Button>
                </Grid>
              </>
            ) : (
              <Button
                style={{ textTransform: "none", marginLeft: 12 }}
                size="small"
                onClick={() => addFields()}
              >
                Gelişmiş arama
              </Button>
            )}
          </Grid>
        </form>

        <Grid container spacing={2} marginTop={0}>
          {data?.matches?.map((d, i) =>
            d?.highlights?.content ? (
              <Grid item xs={12}>
                <CardActionArea
                  onClick={() => window.open(d?.result?.fileURL, "_blank")}
                >
                  <Card
                    key={i}
                    sx={{
                      display: "flex",
                      minHeight: 200,
                      padding: 2,
                      borderRadius: 3,
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{ width: 220 }}
                      image={d?.result?.fileURL + "-thumbnail.jpg"}
                      alt="Resime erişilirken hata oluştu"
                    />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      <CardContent sx={{ flex: "1 0 auto", paddingX: 4 }}>
                        <Box>
                          <Stack
                            direction="row"
                            justifyContent={"space-between"}
                            spacing={2}
                          >
                            <Typography
                              component="div"
                              variant="h5"
                              color="primary"
                              fontWeight="bold"
                            >
                              {String(d.result.name).toUpperCase()}
                            </Typography>
                            <Typography
                              variant="h6"
                              color="text.secondary"
                              component="div"
                            >
                              {new Date(d.result?.date).toLocaleDateString(
                                "tr-TR"
                              )}
                            </Typography>
                          </Stack>

                          <Box>
                            {d?.highlights?.content?.map((c) => (
                              <>
                                <Divider />
                                <Typography
                                  textAlign="left"
                                  variant="body1"
                                  marginTop={1}
                                  fontStyle="italic"
                                >
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: c,
                                    }}
                                  ></div>
                                </Typography>
                              </>
                            ))}
                          </Box>
                        </Box>
                        {context.isLoggedIn && (
                          <>
                            <Box
                              display="flex"
                              justifyContent="end"
                              position="absolute"
                              padding={2}
                              paddingRight={8}
                              sx={{ flexGrow: 1, bottom: 0, right: 0 }}
                            >
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleClickUpdate(d.id, {
                                    name: d.result.name.toString(),
                                    date: d.result.date.toString(),
                                  });
                                }}
                                color="primary"
                              >
                                <EditIcon fontSize="large" />
                              </IconButton>
                            </Box>
                            <Box
                              display="flex"
                              justifyContent="end"
                              position="absolute"
                              padding={2}
                              sx={{ flexGrow: 1, bottom: 0, right: 0 }}
                            >
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleClickDelete(d.id);
                                }}
                                color="error"
                              >
                                <DeleteForeverIcon fontSize="large" />
                              </IconButton>
                            </Box>
                          </>
                        )}
                      </CardContent>
                    </Box>
                  </Card>
                </CardActionArea>
              </Grid>
            ) : (
              <Grid item xs={12} sm={6} md={4}>
                <CardActionArea
                  onClick={() => window.open(d?.result?.fileURL, "_blank")}
                >
                  <Card
                    key={i}
                    sx={{
                      minHeight: 200,
                      padding: 2,
                      borderRadius: 3,
                    }}
                  >
                    <CardContent sx={{ flex: "1 0 auto", paddingX: 1 }}>
                      <Stack
                        direction="row"
                        justifyContent={"space-between"}
                        spacing={2}
                      >
                        <Typography
                          component="div"
                          variant="h5"
                          color="primary"
                          fontWeight="bold"
                        >
                          {String(d.result.name).toUpperCase()}
                        </Typography>
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          component="div"
                        >
                          {new Date(d.result?.date).toLocaleDateString("tr-TR")}
                        </Typography>
                      </Stack>
                    </CardContent>
                    <CardMedia
                      component="img"
                      image={d?.result?.fileURL + "-thumbnail.jpg"}
                      alt="Resime erişilirken hata oluştu"
                    />

                    {context.isLoggedIn && (
                      <>
                        <Box
                          display="flex"
                          justifyContent="end"
                          position="absolute"
                          padding={1}
                          margin={1}
                          sx={{
                            flexGrow: 1,
                            bottom: 0,
                            left: 0,
                            backgroundColor: "white",
                            borderRadius: 2,
                          }}
                        >
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleClickUpdate(d.id, {
                                name: d.result.name.toString(),
                                date: d.result.date.toString(),
                              });
                            }}
                            color="primary"
                            variant="contained"
                          >
                            <EditIcon fontSize="large" />
                          </IconButton>
                        </Box>

                        <Box
                          display="flex"
                          justifyContent="end"
                          position="absolute"
                          padding={1}
                          margin={1}
                          sx={{
                            flexGrow: 1,
                            bottom: 0,
                            right: 0,
                            backgroundColor: "white",
                            borderRadius: 2,
                          }}
                        >
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleClickDelete(d.id);
                            }}
                            color="error"
                            variant="contained"
                          >
                            <DeleteForeverIcon fontSize="large" />
                          </IconButton>
                        </Box>
                      </>
                    )}
                  </Card>
                </CardActionArea>
              </Grid>
            )
          )}
        </Grid>

        {console.log(currentPage)}
        {/*<TablePagination
          component="div"
          count={data?.total?.value||0}
          page={currentPage}
          onPageChange={changeCPage}
          rowsPerPage={pageSize}
          onRowsPerPageChange={setPageSize}
        />*/}
        <DeleteAlertDialog
          dialogOpen={deleteDialogOpen}
          handleClose={handleClose}
        />
        <UpdateDialog
          getData={getData}
          dialogOpen={updateDialogOpen}
          handleClose={handleCloseUpdate}
        />
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

function DeleteAlertDialog({ dialogOpen, handleClose }) {
  return (
    <div>
      <Dialog
        open={dialogOpen.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Gazeteyi tamamen silmek istediğinize emin misiniz?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Gazete çeviri kayıtları ile birlikte aratılabilir gazete pdf'i
            tamemen silinecektir
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Vazgeç</Button>
          <Button onClick={dialogOpen.agreeFunc} autoFocus color="error">
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const UpdateDialog = ({ dialogOpen, handleClose, getData }) => {
  console.log(dialogOpen.formData.name);
  const [name, setName] = useState(dialogOpen.formData.name);
  const [date, setDate] = useState(
    dialogOpen.formData.date && dayjs(dialogOpen.formData.date)
  );

  useEffect(() => {
    setName(dialogOpen.formData.name);
    setDate(dialogOpen.formData.date && dayjs(dialogOpen.formData.date));
  }, [dialogOpen]);

  console.log(name);
  const context = useAuthContext();

  const updateById = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        "http://localhost:3000/pdf-news-doc-orm/" + dialogOpen.formData.id,
        { name: name, date: date },
        {
          headers: {
            Authorization: `Bearer ${context.token}`,
          },
        }
      );
      toast.success("Gazete Güncelleme Başarılı !");
      handleClose && handleClose();
      getData && getData();
    } catch (err) {
      context.updateToken();
    }
  };

  return (
    <Dialog
      open={dialogOpen.open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Kayıt Güncelleme</DialogTitle>
      <DialogContent>
        <Box minWidth={400}></Box>
        <form onSubmit={updateById}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              onChange={(e) => setName(e.target.value)}
              value={name}
              variant="filled"
              label="İsim"
            />{" "}
            <LocalizationProvider dateAdapter={AdapterDayjs} locale="tr">
              <DatePicker
                inputFormat="DD/MM/YYYY"
                label="En Yeni"
                variant="filled"
                value={date}
                onChange={(val) => setDate(val)}
                slotProps={{
                  textField: { variant: "filled", fullWidth: true },
                }}
              ></DatePicker>
            </LocalizationProvider>
            <div className="d-grid">
              <Button variant="contained" size="large" type="submit">
                Güncelle
              </Button>
            </div>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
};
