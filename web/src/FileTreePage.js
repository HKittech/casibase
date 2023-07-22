// Copyright 2023 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from "react";
import {Spin} from "antd";
import * as StoreBackend from "./backend/StoreBackend";
import FileTree from "./FileTree";
import i18next from "i18next";
import * as Setting from "./Setting";

class FileTreePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      owner: props.match?.params?.owner !== undefined ? props.match.params.owner : "admin",
      storeName: props.match?.params?.storeName !== undefined ? props.match.params.storeName : this.props.storeName,
      store: null,
    };
  }

  UNSAFE_componentWillMount() {
    this.getStore();
  }

  getStore() {
    StoreBackend.getStore(this.state.owner, this.state.storeName)
      .then((store) => {
        if (store.status === "ok") {
          if (store.data2 !== null && store.data?.includes("error")) {
            store.data.error = store.data2;
          }

          this.setState({
            store: store.data,
          });
        } else {
          Setting.showMessage("error", `Failed to get store: ${store.msg}`);
        }
      });
  }

  render() {
    if (this.state.store === null) {
      return (
        <div className="App">
          <Spin size="large" tip={i18next.t("general:Loading...")} style={{paddingTop: "10%"}} />
        </div>
      );
    }

    return (
      <FileTree account={this.props.account} store={this.state.store} onUpdateStore={(store) => {
        this.setState({
          store: store,
        });
        Setting.submitStoreEdit(store);
      }} onRefresh={() => this.getStore()} />
    );
  }
}

export default FileTreePage;
